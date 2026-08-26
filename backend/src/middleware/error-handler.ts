import { Request, Response, NextFunction } from "express";

/**
 * Global error handler — catches unhandled errors in route handlers.
 * Returns a consistent JSON error shape.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("❌ Unhandled error:", err.message);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}
