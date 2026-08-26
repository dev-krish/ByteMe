import { prisma } from "../config/database.js";
import { appendAuditLog } from "./audit.service.js";
import type { Prisma } from "@prisma/client";

/**
 * Project Service — CRUD operations for acquisition projects.
 */

/**
 * List projects with optional filters.
 */
export async function listProjects(filters: {
  status?: string;
  stage?: string;
  state?: string;
}) {
  const where: Prisma.ProjectWhereInput = {};
  if (filters.status) where.status = filters.status as any;
  if (filters.stage) where.currentStage = filters.stage as any;
  if (filters.state) where.state = filters.state;

  const projects = await prisma.project.findMany({
    where,
    include: {
      parcels: { select: { id: true, areaHa: true, compensationStatus: true } },
      workflowStages: {
        select: { section: true, status: true, slaDeadline: true },
        orderBy: { section: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

/**
 * Get a single project with full dossier (parcels, milestones, valuations).
 */
export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      parcels: {
        include: {
          valuations: true,
          objections: true,
        },
      },
      workflowStages: {
        orderBy: { section: "asc" },
        include: { completedBy: { select: { name: true } } },
      },
      documents: true,
      createdBy: { select: { name: true, role: true } },
    },
  });

  return project;
}

/**
 * Create a new acquisition project (Form 1 Requisition).
 */
export async function createProject(
  data: {
    code?: string;
    title: string;
    sponsoringAgency: string;
    state: string;
    districts: string[];
    totalAreaHa: number;
    sanctionedBudgetCr: number;
    targetCompletionDate: string;
    description: string;
    officerName: string;
    officerDesignation: string;
  },
  actorId: string
) {
  const code =
    data.code ||
    `ACQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const project = await prisma.$transaction(async (tx) => {
    const proj = await tx.project.create({
      data: {
        code,
        title: data.title,
        sponsoringAgency: data.sponsoringAgency,
        state: data.state,
        districts: data.districts,
        totalAreaHa: data.totalAreaHa,
        sanctionedBudgetCr: data.sanctionedBudgetCr,
        startDate: new Date(),
        targetCompletionDate: new Date(data.targetCompletionDate),
        description: data.description,
        officerName: data.officerName,
        officerDesignation: data.officerDesignation,
        createdById: actorId,
      },
    });

    await appendAuditLog(
      {
        entityType: "PROJECT",
        entityId: proj.id,
        action: "CREATE",
        actorId,
        payload: { code: proj.code, title: proj.title },
      },
      tx
    );

    return proj;
  });

  return project;
}
