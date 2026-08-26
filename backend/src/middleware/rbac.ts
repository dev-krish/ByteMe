import { Request, Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";

/**
 * Role-Based Access Control (RBAC) Middleware Factory.
 * Simulates Keycloak multi-tier authorization.
 *
 * Usage:
 *   router.post("/api/valuation/:id/sign", authenticate, requireRole("CALA", "ADMINISTRATOR"), handler);
 *
 * Must be used AFTER the `authenticate` middleware so that `req.user` is populated.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required before role check.",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Required role(s): ${allowedRoles.join(", ")}. Your role: ${req.user.role}.`,
      });
      return;
    }

    next();
  };
}
