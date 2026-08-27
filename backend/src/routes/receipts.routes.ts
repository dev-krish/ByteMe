import { Router, Request, Response } from "express";
import { generateReceipt } from "../services/receipt.service.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/receipts/:projectId
 * Generate a signed submission receipt with QR code.
 * QR payload contains: project code, total award, UTR numbers,
 * timestamp, and audit hash for offline verification. Authenticated.
 */
router.get("/:projectId", authenticate, async (req: Request, res: Response) => {
  try {
    const result = await generateReceipt(String(req.params.projectId));
    res.json({ success: true, data: result });
  } catch (error: any) {
    const status = error.message?.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

export default router;
