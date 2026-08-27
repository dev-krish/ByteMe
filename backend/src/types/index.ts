// ─────────────────────────────────────────────────────────
// NLAMS Backend — Shared Types
// Mirrors the frontend TypeScript interfaces from src/types/index.ts
// so API responses are drop-in compatible.
// ─────────────────────────────────────────────────────────

import type { UserRole } from "@prisma/client";

// ── Auth ──

export interface LoginRequest {
  email: string;
  password: string;
  dscChallenge?: string; // Simulated DSC token for e-Sign auth
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    agency: string | null;
  };
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

// ── Compensation (mirrors frontend CompensationInput / CompensationBreakdown) ──

export interface CompensationInput {
  baseMarketRatePerHa?: number; // Calculated or manual
  circleRatePerHa?: number; // Government circle / collector rate
  saleDeedAvgRatePerHa?: number; // Average of top 50% 3-year registered sale deeds
  areaHa: number;
  isRural: boolean;
  distanceFromUrbanKm: number; // Determines multiplier (1.0 to 2.0)
  structureValuationLakhs: number;
  treesCropsValuationLakhs: number;
  interestMonths: number; // 12% p.a. from Sec 11 to Award
  rehabilitationAssistanceLakhs: number;
  solatiumPercentage?: number; // Statutory 100%
}

export interface CompensationBreakdown {
  baseLandValueLakhs: number;
  multiplierFactor: number;
  multipliedLandValueLakhs: number;
  solatiumLakhs: number; // 100% of multiplied land value
  interest12PctLakhs: number; // 12% per annum on market value
  structureAndAssetsLakhs: number;
  grossCompensationLakhs: number;
  rehabilitationGrantLakhs: number;
  totalPayableLakhs: number;
  currencyFormattedTotal: string;
}

// ── Dashboard ──

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  totalAreaAcquiredHa: number;
  totalDisbursedCr: number;
  slaCompliancePct: number;
  stageBreakdown: Record<string, number>;
  redFlags: RedFlag[];
  budgetUtilizationPct: number;
}

export interface RedFlag {
  id: string;
  project: string;
  agency: string;
  location: string;
  breachType: string;
  delay: string;
  severity: "CRITICAL" | "WARNING" | "LITIGATION";
}

// ── Express Request augmentation ──

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
