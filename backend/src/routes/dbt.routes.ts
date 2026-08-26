import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { dispatchDBT, getDBTStatus } from "../services/dbt.service.js";

const router = Router();

const dispatchSchema = z.object({
  valuationId: z.string(),
  beneficiary: z.object({
    name: z.string().min(1),
    aadhaarLast4: z.string().length(4),
    bankAccountMasked: z.string().min(4),
    ifsc: z.string().min(8),
  }),
});

/**
 * POST /api/dbt/dispatch
 * Queue PFMS batch disbursement (mock).
 * Guards: Section 64 — refuses if parcel has DISPUTED title.
 */
router.post(
  "/dispatch",
  authenticate,
  requireRole("CALA", "ADMINISTRATOR"),
  async (req: Request, res: Response) => {
    try {
      const body = dispatchSchema.parse(req.body);
      const transaction = await dispatchDBT(
        body.valuationId,
        body.beneficiary,
        req.user!.userId
      );

      res.status(201).json({
        success: true,
        data: {
          transactionId: transaction.id,
          utrNumber: transaction.utrNumber,
          status: transaction.status,
          amount: transaction.amount,
          message:
            "DBT queued. Status will progress: QUEUED → DISPATCHED → CREDITED.",
        },
      });
    } catch (error: any) {
      const status = error.message?.includes("HARD BLOCK") ? 422 : 500;
      res.status(status).json({ success: false, error: error.message });
    }
  }
);

/**
 * GET /api/dbt/:id/status
 * Poll disbursement status.
 */
router.get("/:id/status", async (req: Request, res: Response) => {
  try {
    const transaction = await getDBTStatus(String(req.params.id));
    if (!transaction) {
      res
        .status(404)
        .json({ success: false, error: "Transaction not found." });
      return;
    }

    res.json({ success: true, data: transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
