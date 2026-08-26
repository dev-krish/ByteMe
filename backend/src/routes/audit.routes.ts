import { Router, Request, Response } from "express";
import { getAuditChain } from "../services/audit.service.js";

const router = Router();

/**
 * GET /api/audit/:entityType/:entityId
 * Hash-chained audit trail for an entity.
 * Returns ordered chain with per-entry hash verification.
 */
router.get("/:entityType/:entityId", async (req: Request, res: Response) => {
  try {
    const entityType = String(req.params.entityType);
    const entityId = String(req.params.entityId);
    const chain = await getAuditChain(entityType.toUpperCase(), entityId);

    const allVerified = chain.length > 0 && chain.every((e) => e.verified);

    res.json({
      success: true,
      data: {
        entityType: entityType.toUpperCase(),
        entityId,
        totalEntries: chain.length,
        chainIntegrity: allVerified ? "VERIFIED" : chain.length === 0 ? "EMPTY" : "BROKEN",
        entries: chain,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
