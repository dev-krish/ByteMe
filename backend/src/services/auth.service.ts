import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import type {
  RegisterRequest,
  LoginRequest,
  CitizenLoginRequest,
  LoginResponse,
  JwtPayload,
} from "../types/index.js";

/**
 * Auth Service — JWT-based authentication with simulated DSC, email/password, and UIDAI OTP.
 * Supports RBAC tiers (CITIZEN → SURVEYOR → CALA → ADMINISTRATOR → MINISTRY).
 */

const OTP_CACHE = new Map<string, { otp: string; expiresAt: number }>();

/**
 * Dispatch simulated OTP for Aadhaar or Mobile number
 */
export function sendOtp(identifier: string): { success: boolean; message: string; demoOtp: string } {
  const clean = identifier.replace(/[\s-]/g, "");
  const demoOtp = "123456";
  OTP_CACHE.set(clean, {
    otp: demoOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return {
    success: true,
    message: `UIDAI Aadhaar OTP dispatched to linked mobile ending in ••••${clean.slice(-4)}`,
    demoOtp,
  };
}

/**
 * Verify OTP
 */
export function verifyOtp(identifier: string, otp: string): boolean {
  const clean = identifier.replace(/[\s-]/g, "");
  if (otp === "123456") return true;

  const stored = OTP_CACHE.get(clean);
  if (stored && stored.otp === otp && Date.now() <= stored.expiresAt) {
    OTP_CACHE.delete(clean);
    return true;
  }
  return false;
}

/**
 * Citizen Login via Aadhaar / Mobile number
 */
export async function loginCitizen(input: CitizenLoginRequest): Promise<LoginResponse> {
  const cleanId = input.identifier.replace(/[\s-]/g, "");

  // If OTP provided, verify it
  if (input.otp && !verifyOtp(cleanId, input.otp)) {
    throw new Error("Invalid or expired UIDAI Aadhaar OTP. Use demo OTP: 123456.");
  }

  // Look for existing citizen user or find citizen with matching email/name
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: cleanId },
        { email: "citizen@nlams.gov.in" },
        { role: "CITIZEN" },
      ],
    },
  });

  // If no user exists, create a default citizen user in DB
  if (!user) {
    const passwordHash = await bcrypt.hash(Math.random().toString(36), 12);
    user = await prisma.user.create({
      data: {
        name: "Rameshwar Prasad Meena",
        email: `citizen.${cleanId.slice(-4) || "demo"}@nlams.gov.in`,
        passwordHash,
        role: "CITIZEN",
        aadhaarLinked: true,
        agency: "Landowner (Dausa)",
      },
    });
  }

  const payload: JwtPayload = {
    userId: user.id,
    role: "CITIZEN",
    email: user.email,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "CITIZEN",
      agency: user.agency,
      aadhaarLinked: user.aadhaarLinked,
    },
  };
}

/**
 * Authenticate an officer/user with email + password, optionally with DSC challenge.
 */
export async function loginUser(input: LoginRequest): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("Invalid credentials — user not found.");
  }

  const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordValid) {
    throw new Error("Invalid credentials — wrong password.");
  }

  // Simulated DSC challenge-response
  if (input.dscChallenge) {
    if (user.dscTokenSimulated !== input.dscChallenge) {
      throw new Error("DSC verification failed — token mismatch.");
    }
  }

  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      agency: user.agency,
      aadhaarLinked: user.aadhaarLinked,
    },
  };
}

/**
 * Register a new user with Email + Password and optional Role (CITIZEN, SURVEYOR, CALA, etc.)
 */
export async function registerUser(input: RegisterRequest): Promise<LoginResponse> {
  const normalizedEmail = input.email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("An account with this email address already exists.");
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create new user in PostgreSQL database
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: input.role || "CITIZEN",
      agency: input.agency?.trim() || (input.role === "CITIZEN" ? "Landowner" : "State Revenue Dept"),
      designation: input.designation?.trim() || (input.role === "CITIZEN" ? "Landowner" : "Officer"),
      aadhaarLinked: input.role === "CITIZEN",
    },
  });

  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      agency: user.agency,
      aadhaarLinked: user.aadhaarLinked,
    },
  };
}

/**
 * Hash a password for storage.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

