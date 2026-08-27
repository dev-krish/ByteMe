import { Router, Request, Response } from "express";
import { prisma } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/dashboard/summary
 * National KPIs: active projects, area acquired, DBT total, SLA compliance %.
 * Gated with JWT authentication.
 */
router.get("/summary", authenticate, async (_req: Request, res: Response) => {
  try {
    // Total and active projects
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: { status: { not: "COMPLETED" } },
    });

    // Area aggregation
    const areaAgg = await prisma.project.aggregate({
      _sum: {
        totalAreaHa: true,
        acquiredAreaHa: true,
        sanctionedBudgetCr: true,
        disbursedCompensationCr: true,
      },
    });

    // SLA compliance — stages that completed without breaching
    const totalStages = await prisma.workflowStage.count({
      where: { status: { in: ["COMPLETED", "SLA_BREACHED"] } },
    });
    const breachedStages = await prisma.workflowStage.count({
      where: { status: "SLA_BREACHED" },
    });
    const slaCompliancePct =
      totalStages > 0
        ? Math.round(((totalStages - breachedStages) / totalStages) * 1000) / 10
        : 100;

    // Stage breakdown — count projects per current stage
    const stageBreakdown: Record<string, number> = {};
    const stageGroups = await prisma.project.groupBy({
      by: ["currentStage"],
      _count: true,
    });
    for (const sg of stageGroups) {
      stageBreakdown[sg.currentStage] = sg._count;
    }

    // Red flags — projects with SLA breaches or disputed parcels
    const redFlagProjects = await prisma.project.findMany({
      where: {
        OR: [
          { status: "SLA_BREACH" },
          { parcels: { some: { titleStatus: "DISPUTED" } } },
        ],
      },
      include: {
        workflowStages: {
          where: { status: "SLA_BREACHED" },
          select: { section: true, slaDeadline: true },
        },
        parcels: {
          where: { titleStatus: "DISPUTED" },
          select: { khasraNumber: true },
        },
      },
      take: 10,
    });

    const redFlags = redFlagProjects.map((p) => {
      const breachedStage = p.workflowStages[0];
      const disputedParcel = p.parcels[0];

      let breachType = "Unknown";
      let delay = "Pending";
      let severity: "CRITICAL" | "WARNING" | "LITIGATION" = "WARNING";

      if (breachedStage) {
        breachType = `${breachedStage.section} SLA Exceeded`;
        const daysOverdue = breachedStage.slaDeadline
          ? Math.ceil(
              (Date.now() - breachedStage.slaDeadline.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;
        delay = `${daysOverdue} Days Overdue`;
        severity = "CRITICAL";
      } else if (disputedParcel) {
        breachType = `Litigation Stay on ${disputedParcel.khasraNumber} (Sec 64)`;
        delay = "Tribunal Pending";
        severity = "LITIGATION";
      }

      return {
        id: p.id,
        project: p.title,
        agency: p.sponsoringAgency,
        location: `${p.districts[0] || ""}, ${p.state}`,
        breachType,
        delay,
        severity,
      };
    });

    // Budget utilization
    const totalBudget = areaAgg._sum.sanctionedBudgetCr || 0;
    const totalDisbursed = areaAgg._sum.disbursedCompensationCr || 0;
    const budgetUtilizationPct =
      totalBudget > 0
        ? Math.round((totalDisbursed / totalBudget) * 1000) / 10
        : 0;

    res.json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        totalAreaAcquiredHa: Math.round(areaAgg._sum.totalAreaHa || 0),
        totalDisbursedCr: Math.round((totalDisbursed) * 10) / 10,
        slaCompliancePct,
        stageBreakdown,
        redFlags,
        budgetUtilizationPct,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch dashboard summary.",
    });
  }
});

export default router;
