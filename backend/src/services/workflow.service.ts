import { prisma } from "../config/database.js";
import { appendAuditLog } from "../services/audit.service.js";
import {
  STAGE_TRANSITIONS,
  STAGE_ORDER,
  BACKEND_STAGE_MAP,
  type GuardCondition,
} from "../engine/workflow-fsm.js";
import type { StatutorySection } from "@prisma/client";

/**
 * Workflow Service — Manages project lifecycle transitions.
 */

/**
 * Initialize all workflow stages for a new project.
 * Creates one WorkflowStage row per statutory section, with the first
 * stage set to IN_PROGRESS and its SLA deadline computed.
 */
export async function initializeWorkflow(
  projectId: string,
  actorId: string
): Promise<void> {
  const now = new Date();

  const stageData = STAGE_ORDER.map((section: StatutorySection, index: number) => {
    const config = STAGE_TRANSITIONS[section];
    const isFirst = index === 0;
    const slaDeadline = new Date(now);
    slaDeadline.setDate(slaDeadline.getDate() + config.slaDays);

    return {
      projectId,
      section,
      status: isFirst ? ("IN_PROGRESS" as const) : ("PENDING" as const),
      slaDays: config.slaDays,
      slaDeadline: isFirst ? slaDeadline : null,
      startedAt: isFirst ? now : null,
      name: config.name,
      actReference: config.actReference,
      officerInCharge: null,
    };
  });

  await prisma.workflowStage.createMany({ data: stageData });

  await appendAuditLog({
    entityType: "WORKFLOW",
    entityId: projectId,
    action: "WORKFLOW_INITIALIZED",
    actorId,
    payload: { stages: STAGE_ORDER, startedStage: "SEC_4" },
  });
}

/**
 * Validate all guard conditions for a stage transition.
 * Returns an array of failure messages (empty = all guards passed).
 */
export async function validateGuards(
  projectId: string,
  guards: GuardCondition[]
): Promise<string[]> {
  const failures: string[] = [];

  for (const guard of guards) {
    switch (guard) {
      case "ALL_OBJECTIONS_RESOLVED": {
        // Section 15: All objections must be resolved before proceeding
        const openObjections = await prisma.objection.count({
          where: {
            parcel: { projectId },
            status: "OPEN",
          },
        });
        if (openObjections > 0) {
          failures.push(
            `Guard FAILED: ${openObjections} unresolved objection(s) remain. ` +
              `All Sec 15 objections must be resolved before advancing.`
          );
        }
        break;
      }

      case "VALUATION_COMPLETE": {
        // Section 23: All parcels must have a completed valuation
        const parcels = await prisma.parcel.findMany({
          where: { projectId },
          include: { valuations: true },
        });
        const unvalued = parcels.filter((p) => p.valuations.length === 0);
        if (unvalued.length > 0) {
          failures.push(
            `Guard FAILED: ${unvalued.length} parcel(s) lack valuation. ` +
              `All parcels must be valued per Sec 23 before advancing.`
          );
        }
        break;
      }

      case "NO_DISPUTED_PARCELS": {
        // Section 64: Hard-block — disputed parcels cannot enter DBT stage
        const disputed = await prisma.parcel.count({
          where: { projectId, titleStatus: "DISPUTED" },
        });
        if (disputed > 0) {
          failures.push(
            `Guard FAILED (HARD BLOCK — Sec 64): ${disputed} parcel(s) have ` +
              `DISPUTED title status. Resolve litigation before disbursement.`
          );
        }
        break;
      }

      case "DBT_DISPATCHED": {
        // All valuations must have a DBT transaction queued/dispatched/credited
        const valuations = await prisma.valuation.findMany({
          where: { parcel: { projectId } },
          include: { dbtTransactions: true },
        });
        const noDBT = valuations.filter(
          (v) => v.dbtTransactions.length === 0
        );
        if (noDBT.length > 0) {
          failures.push(
            `Guard FAILED: ${noDBT.length} valuation(s) have no DBT dispatch. ` +
              `Queue PFMS disbursement before advancing to possession.`
          );
        }
        break;
      }
    }
  }

  return failures;
}

/**
 * Advance a project to its next statutory stage.
 * Validates guard conditions, completes the current stage,
 * starts the next stage, and writes audit entries.
 */
export async function advanceWorkflow(
  projectId: string,
  actorId: string
): Promise<{
  success: boolean;
  previousStage: StatutorySection;
  currentStage: StatutorySection | null;
  message: string;
  guardFailures?: string[];
}> {
  // Get project's current stage
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { currentStage: true, code: true },
  });

  if (!project) {
    throw new Error(`Project ${projectId} not found.`);
  }

  const currentSection = project.currentStage;
  const stageConfig = STAGE_TRANSITIONS[currentSection];

  if (!stageConfig.next) {
    return {
      success: false,
      previousStage: currentSection,
      currentStage: null,
      message: `Project is at terminal stage (${currentSection}). No further transitions.`,
    };
  }

  const nextSection = stageConfig.next;
  const nextConfig = STAGE_TRANSITIONS[nextSection];

  // Validate guards for the NEXT stage
  const guardFailures = await validateGuards(projectId, stageConfig.guards);
  if (guardFailures.length > 0) {
    return {
      success: false,
      previousStage: currentSection,
      currentStage: null,
      message: "Transition blocked by guard conditions.",
      guardFailures,
    };
  }

  const now = new Date();
  const slaDeadline = new Date(now);
  slaDeadline.setDate(slaDeadline.getDate() + nextConfig.slaDays);

  // Execute transition in a single transaction
  await prisma.$transaction(async (tx) => {
    // 1. Complete current stage
    await tx.workflowStage.update({
      where: {
        projectId_section: { projectId, section: currentSection },
      },
      data: {
        status: "COMPLETED",
        completedAt: now,
        completedById: actorId,
      },
    });

    // 2. Start next stage
    await tx.workflowStage.update({
      where: {
        projectId_section: { projectId, section: nextSection },
      },
      data: {
        status: "IN_PROGRESS",
        startedAt: now,
        slaDeadline,
      },
    });

    // 3. Update project's current stage
    const stageIndex = STAGE_ORDER.indexOf(nextSection);
    const progress = Math.round((stageIndex / (STAGE_ORDER.length - 1)) * 100);
    await tx.project.update({
      where: { id: projectId },
      data: {
        currentStage: nextSection,
        stageProgress: progress,
        slaDaysRemaining: nextConfig.slaDays,
      },
    });

    // 4. Audit log
    await appendAuditLog(
      {
        entityType: "WORKFLOW",
        entityId: projectId,
        action: "STAGE_ADVANCE",
        actorId,
        payload: {
          from: currentSection,
          to: nextSection,
          actReference: nextConfig.actReference,
          slaDeadline: slaDeadline.toISOString(),
        },
      },
      tx
    );
  });

  return {
    success: true,
    previousStage: currentSection,
    currentStage: nextSection,
    message: `Advanced from ${currentSection} to ${nextSection}. SLA: ${nextConfig.slaDays} days.`,
  };
}

/**
 * Get the workflow history for a project, formatted for the frontend.
 * Returns milestones matching the frontend's Milestone interface.
 */
export async function getWorkflowHistory(projectId: string) {
  const stages = await prisma.workflowStage.findMany({
    where: { projectId },
    orderBy: { section: "asc" },
    include: {
      completedBy: { select: { name: true } },
    },
  });

  // Sort by stage order
  const sorted = STAGE_ORDER.map((section: StatutorySection) =>
    stages.find((s: any) => s.section === section)
  ).filter(Boolean);

  return sorted.map((stage: any) => {
    const config = STAGE_TRANSITIONS[stage!.section as StatutorySection];
    const remainingDays =
      stage!.slaDeadline && stage!.status === "IN_PROGRESS"
        ? Math.max(
            0,
            Math.ceil(
              (stage!.slaDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
          )
        : 0;

    // Map to frontend status
    let frontendStatus: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "DELAYED";
    switch (stage!.status) {
      case "COMPLETED":
        frontendStatus = "COMPLETED";
        break;
      case "IN_PROGRESS":
        frontendStatus = "IN_PROGRESS";
        break;
      case "SLA_BREACHED":
        frontendStatus = "DELAYED";
        break;
      default:
        frontendStatus = "PENDING";
    }

    return {
      id: stage!.id,
      code: config.milestoneCode,
      name: config.name,
      section: `Section ${stage!.section.replace("SEC_", "")}`,
      actReference: config.actReference,
      status: frontendStatus,
      targetDate: stage!.slaDeadline?.toISOString().split("T")[0] ?? "",
      completedDate: stage!.completedAt?.toISOString().split("T")[0],
      officerInCharge: stage!.officerInCharge ?? "Not assigned",
      slaDays: config.slaDays,
      remainingDays,
      documents: [], // Documents would be fetched separately
    };
  });
}
