import { Router, Request, Response } from "express";
import { z } from "zod";
import { loginUser } from "../services/auth.service.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  dscChallenge: z.string().optional(),
});

/**
 * POST /api/auth/login
 * Role-based login with optional simulated DSC challenge.
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await loginUser(body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const status = error.message?.includes("Invalid credentials") ? 401 : 400;
    res.status(status).json({
      success: false,
      error: error.message || "Login failed.",
    });
  }
});

export default router;
