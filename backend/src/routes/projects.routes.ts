import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import {
  listProjects,
  getProjectById,
  createProject,
} from "../services/project.service.js";
import { createParcel } from "../services/parcel.service.js";
import {
  initializeWorkflow,
  advanceWorkflow,
  getWorkflowHistory,
} from "../services/workflow.service.js";
import { BACKEND_STAGE_MAP } from "../engine/workflow-fsm.js";

const router = Router();

// ── Schemas ──

const createProjectSchema = z.object({
  code: z.string().optional(),
  title: z.string().min(3),
  sponsoringAgency: z.string().min(2),
  state: z.string().min(2),
  districts: z.array(z.string()).min(1),
  totalAreaHa: z.number().positive(),
  sanctionedBudgetCr: z.number().positive(),
  targetCompletionDate: z.string(),
  description: z.string().min(10),
  officerName: z.string().min(2),
  officerDesignation: z.string().min(2),
});

const createParcelSchema = z.object({
  khasraNumber: z.string().min(1),
  village: z.string().min(1),
  tehsil: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  areaHa: z.number().positive(),
  landUse: z.string().optional(),
  soilClassification: z.string().optional(),
  ownerName: z.string().min(1),
  aadhaarLinked: z.boolean().optional(),
  panNo: z.string().optional(),
  circleRatePerHa: z.number().positive(),
  saleDeedAvgRatePerHa: z.number().positive(),
  coordinates: z.array(z.tuple([z.number(), z.number()])).min(3),
  structuresCount: z.number().optional(),
  treesCount: z.number().optional(),
});

// ── Routes ──

/**
 * GET /api/projects
 * List/filter projects. Public (no auth required for demo).
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await listProjects({
      status: req.query.status as string | undefined,
      stage: req.query.stage as string | undefined,
      state: req.query.state as string | undefined,
    });

    // Map to frontend-compatible shape
    const data = projects.map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      sponsoringAgency: p.sponsoringAgency,
      state: p.state,
      districts: p.districts,
      totalAreaHa: p.totalAreaHa,
      acquiredAreaHa: p.acquiredAreaHa,
      affectedVillagesCount: p.affectedVillagesCount,
      affectedFamiliesCount: p.affectedFamiliesCount,
      sanctionedBudgetCr: p.sanctionedBudgetCr,
      disbursedCompensationCr: p.disbursedCompensationCr,
      currentStage: BACKEND_STAGE_MAP[p.currentStage] || p.currentStage,
      stageProgress: p.stageProgress,
      status: p.status,
      slaWarning: p.slaWarning,
      slaDaysRemaining: p.slaDaysRemaining,
      startDate: p.startDate.toISOString().split("T")[0],
      targetCompletionDate: p.targetCompletionDate.toISOString().split("T")[0],
      description: p.description,
      officerName: p.officerName,
      officerDesignation: p.officerDesignation,
      milestones: [], // Populated separately via /workflow
    }));

    res.json({ success: true, total: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects
 * Create a new requisition (Form 1 intake).
 */
router.post(
  "/",
  authenticate,
  requireRole("CALA", "ADMINISTRATOR", "MINISTRY"),
  async (req: Request, res: Response) => {
    try {
      const body = createProjectSchema.parse(req.body);
      const project = await createProject(body, req.user!.userId);

      // Initialize the workflow stages
      await initializeWorkflow(project.id, req.user!.userId);

      res.status(201).json({ success: true, data: project });
    } catch (error: any) {
      const status = error.name === "ZodError" ? 400 : 500;
      res.status(status).json({ success: false, error: error.message });
    }
  }
);

/**
 * GET /api/projects/:id
 * Full case dossier.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const project = await getProjectById(String(req.params.id));
    if (!project) {
      res.status(404).json({ success: false, error: "Project not found." });
      return;
    }

    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects/:id/parcels
 * Attach parcels (Khasra upload).
 */
router.post(
  "/:id/parcels",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const body = createParcelSchema.parse(req.body);
      const parcel = await createParcel(
        { ...body, projectId: String(req.params.id) },
        req.user!.userId
      );

      res.status(201).json({ success: true, data: parcel });
    } catch (error: any) {
      const status = error.name === "ZodError" ? 400 : 500;
      res.status(status).json({ success: false, error: error.message });
    }
  }
);

/**
 * GET /api/projects/:id/workflow
 * Current stage + full history (milestones).
 */
router.get("/:id/workflow", async (req: Request, res: Response) => {
  try {
    const milestones = await getWorkflowHistory(String(req.params.id));
    res.json({ success: true, data: { milestones } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects/:id/workflow/advance
 * Transition to next statutory stage (validates guards).
 */
router.post(
  "/:id/workflow/advance",
  authenticate,
  requireRole("CALA", "ADMINISTRATOR", "MINISTRY"),
  async (req: Request, res: Response) => {
    try {
      const result = await advanceWorkflow(String(req.params.id), req.user!.userId);

      if (!result.success) {
        res.status(422).json({ ...result, success: false });
        return;
      }

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
