import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import type {
  LoginRequest,
  CitizenLoginRequest,
  LoginResponse,
  JwtPayload,
} from "../types/index.js";

/**
 * Auth Service — JWT-based authentication with simulated DSC and UIDAI OTP.
 * Supports RBAC tiers (CITIZEN → SURVEYOR → CALA → ADMINISTRATOR → MINISTRY).
 */

const OTP_CACHE = new Map<string, { otp: string; expiresAt: number }>();

/**
 * Mask email address for privacy in verification notices (e.g., r***@domain.com)
 */
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const maskedUser = user.length > 2 ? `${user[0]}•••${user.slice(-1)}` : `${user[0]}•`;
  return `${maskedUser}@${domain}`;
}

/**
 * Dispatch OTP for Aadhaar, Mobile, or Registered Email
 */
export function sendOtp(
  identifier: string,
  channel: "AADHAAR" | "EMAIL" = identifier.includes("@") ? "EMAIL" : "AADHAAR"
): { success: boolean; message: string; demoOtp: string; channel: "AADHAAR" | "EMAIL" } {
  const clean = identifier.replace(/[\s-]/g, "").toLowerCase();
  const demoOtp = "123456";
  OTP_CACHE.set(clean, {
    otp: demoOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  const message =
    channel === "EMAIL"
      ? `Verification code dispatched to registered email ${maskEmail(identifier)}`
      : `UIDAI Aadhaar OTP dispatched to linked mobile ending in ••••${clean.slice(-4)}`;

  return {
    success: true,
    message,
    demoOtp,
    channel,
  };
}

/**
 * Verify OTP
 */
export function verifyOtp(identifier: string, otp: string): boolean {
  const clean = identifier.replace(/[\s-]/g, "").toLowerCase();
  if (otp === "123456") return true;

  const stored = OTP_CACHE.get(clean);
  if (stored && stored.otp === otp && Date.now() <= stored.expiresAt) {
    OTP_CACHE.delete(clean);
    return true;
  }
  return false;
}

/**
 * Citizen Login via Aadhaar / Mobile number / Email
 */
export async function loginCitizen(input: CitizenLoginRequest): Promise<LoginResponse> {
  const cleanId = input.identifier.replace(/[\s-]/g, "").toLowerCase();
  const channel = input.verificationChannel || (input.identifier.includes("@") ? "EMAIL" : "AADHAAR");

  // If OTP provided, verify it
  if (input.otp && !verifyOtp(cleanId, input.otp)) {
    const errorMsg =
      channel === "EMAIL"
        ? "Invalid or expired Email verification code. Use demo OTP: 123456."
        : "Invalid or expired UIDAI Aadhaar OTP. Use demo OTP: 123456.";
    throw new Error(errorMsg);
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
    const passwordHash = await bcrypt.hash("nlams2026", 12);
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
 * Hash a password for storage.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
