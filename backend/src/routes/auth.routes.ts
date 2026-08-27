import { Router, Request, Response } from "express";
import { z } from "zod";
import {
  loginUser,
  loginCitizen,
  sendOtp,
  verifyOtp,
} from "../services/auth.service.js";
import { authenticate } from "../middleware/auth.js";
import { prisma } from "../config/database.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  dscChallenge: z.string().optional(),
});

const citizenLoginSchema = z.object({
  identifier: z.string().min(1),
  otp: z.string().optional(),
});

const otpSchema = z.object({
  identifier: z.string().min(1),
  otp: z.string().optional(),
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

/**
 * POST /api/auth/citizen-login
 * Aadhaar / Phone OTP citizen authentication.
 */
router.post("/citizen-login", async (req: Request, res: Response) => {
  try {
    const body = citizenLoginSchema.parse(req.body);
    const result = await loginCitizen(body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const status = error.message?.includes("OTP") ? 401 : 400;
    res.status(status).json({
      success: false,
      error: error.message || "Citizen login failed.",
    });
  }
});

/**
 * POST /api/auth/send-otp
 * Dispatches simulated UIDAI Aadhaar OTP
 */
router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { identifier } = otpSchema.parse(req.body);
    const result = sendOtp(identifier);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to dispatch OTP.",
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies 6-digit UIDAI OTP
 */
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      res.status(400).json({
        success: false,
        error: "Identifier and OTP are required.",
      });
      return;
    }

    const isValid = verifyOtp(identifier, otp);
    if (!isValid) {
      res.status(400).json({
        success: false,
        error: "Invalid or expired OTP. Use demo OTP: 123456.",
      });
      return;
    }

    res.json({
      success: true,
      message: "UIDAI Aadhaar OTP verified.",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to verify OTP.",
    });
  }
});

/**
 * GET /api/auth/me
 * Authenticated user profile
 */
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        agency: true,
        designation: true,
        aadhaarLinked: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found." });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
