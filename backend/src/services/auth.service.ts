import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import type { LoginRequest, LoginResponse, JwtPayload } from "../types/index.js";

/**
 * Auth Service — JWT-based authentication with simulated DSC.
 * Simulates Keycloak's RBAC tiers for the hackathon prototype.
 */

/**
 * Authenticate a user with email + password, optionally with DSC challenge.
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
  // In production, this would verify against a real Class 3 Hardware DSC bridge via NIC's e-Sign API.
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
    },
  };
}

/**
 * Hash a password for storage.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
