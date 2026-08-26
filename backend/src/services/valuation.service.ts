import { prisma } from "../config/database.js";
import { computeRFCTLARRCompensation } from "../engine/rfctlarr-calculator.js";
import { appendAuditLog } from "./audit.service.js";
import type { CompensationInput } from "../types/index.js";

/**
 * Valuation Service — Persists RFCTLARR compensation computations.
 */

/**
 * Compute and persist a valuation for a parcel.
 */
export async function computeAndSaveValuation(
  parcelId: string,
  input: CompensationInput,
  actorId: string
) {
  const breakdown = computeRFCTLARRCompensation(input);

  const valuation = await prisma.$transaction(async (tx) => {
    const val = await tx.valuation.create({
      data: {
        parcelId,
        baseMarketValue: breakdown.baseLandValueLakhs,
        ruralMultiplier: breakdown.multiplierFactor,
        multipliedValue: breakdown.multipliedLandValueLakhs,
        assetValue: breakdown.structureAndAssetsLakhs,
        solatium: breakdown.solatiumLakhs,
        interest: breakdown.interest12PctLakhs,
        interestMonths: input.interestMonths,
        rrGrant: breakdown.rehabilitationGrantLakhs,
        totalAward: breakdown.totalPayableLakhs,
      },
    });

    // Update parcel's awarded amount and compensation status
    await tx.parcel.update({
      where: { id: parcelId },
      data: {
        awardedAmountLakhs: breakdown.totalPayableLakhs,
        compensationStatus: "AWARD_PUBLISHED",
      },
    });

    await appendAuditLog(
      {
        entityType: "VALUATION",
        entityId: val.id,
        action: "CREATE",
        actorId,
        payload: {
          parcelId,
          totalAward: breakdown.totalPayableLakhs,
          formula: "RFCTLARR-2013-v1",
          breakdown,
        },
      },
      tx
    );

    return val;
  });

  return { valuation, breakdown };
}

/**
 * CALA DSC sign-off for a valuation.
 * Requires CALA role (enforced at route level).
 */
export async function signValuation(valuationId: string, actorId: string) {
  const valuation = await prisma.$transaction(async (tx) => {
    const val = await tx.valuation.update({
      where: { id: valuationId },
      data: {
        signedByCala: true,
        signedAt: new Date(),
      },
    });

    await appendAuditLog(
      {
        entityType: "VALUATION",
        entityId: valuationId,
        action: "DSC_SIGN",
        actorId,
        payload: {
          signedAt: new Date().toISOString(),
          signedBy: actorId,
          totalAward: val.totalAward,
        },
      },
      tx
    );

    return val;
  });

  return valuation;
}
