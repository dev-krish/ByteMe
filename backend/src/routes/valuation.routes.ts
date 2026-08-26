import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { computeRFCTLARRCompensation } from "../engine/rfctlarr-calculator.js";
import {
  computeAndSaveValuation,
  signValuation,
} from "../services/valuation.service.js";

const router = Router();

const computeSchema = z.object({
  parcelId: z.string().optional(), // If provided, persists the valuation
  baseMarketRatePerHa: z.number().positive(),
  areaHa: z.number().positive(),
  isRural: z.boolean(),
  distanceFromUrbanKm: z.number().min(0),
  structureValuationLakhs: z.number().min(0),
  treesCropsValuationLakhs: z.number().min(0),
  interestMonths: z.number().min(0),
  rehabilitationAssistanceLakhs: z.number().min(0),
  solatiumPercentage: z.number().min(0).max(200).optional(),
});

/**
 * POST /api/valuation/compute
 * Run RFCTLARR formula for a parcel.
 *
 * If `parcelId` is provided, persists the valuation to the database.
 * Otherwise, returns a calculation-only result (stateless).
 */
router.post("/compute", async (req: Request, res: Response) => {
  try {
    const body = computeSchema.parse(req.body);
    const { parcelId, ...input } = body;

    if (parcelId && req.user) {
      // Persist to database
      const { valuation, breakdown } = await computeAndSaveValuation(
        parcelId,
        input,
        req.user.userId
      );
      res.json({
        success: true,
        data: {
          valuationId: valuation.id,
          breakdown,
          persisted: true,
        },
      });
    } else {
      // Stateless computation (for the calculator UI)
      const breakdown = computeRFCTLARRCompensation(input);
      res.json({
        success: true,
        data: {
          breakdown,
          persisted: false,
        },
      });
    }
  } catch (error: any) {
    const status = error.name === "ZodError" ? 400 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/valuation/:id/sign
 * CALA DSC sign-off for a valuation.
 * Requires CALA or ADMINISTRATOR role.
 */
router.post(
  "/:id/sign",
  authenticate,
  requireRole("CALA", "ADMINISTRATOR"),
  async (req: Request, res: Response) => {
    try {
      const valuation = await signValuation(String(req.params.id), req.user!.userId);
      res.json({ success: true, data: valuation });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
