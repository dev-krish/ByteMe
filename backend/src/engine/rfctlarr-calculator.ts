import type { CompensationInput, CompensationBreakdown } from "../types/index.js";

/**
 * RFCTLARR-2013 Statutory Compensation Engine
 * =============================================
 * Pure function — zero side effects, fully unit-testable.
 *
 * Reference: The Right to Fair Compensation and Transparency in
 * Land Acquisition, Rehabilitation and Resettlement Act, 2013
 *
 * FIRST SCHEDULE (Sections 26-30):
 *
 * 1. Base Market Value = Max(Circle Rate, Avg 3yr Sale Deeds) × Area
 *    [Section 26(1)]
 *
 * 2. Multiplier Factor (Section 26(1)(b)):
 *    - Urban areas: 1.00×
 *    - Rural areas: varies by distance from nearest urban boundary:
 *        • 0 - 10 km:  1.25×
 *        • 10 - 20 km: 1.50×
 *        • 20 - 30 km: 1.75×
 *        • > 30 km:    2.00×
 *
 * 3. Solatium: 100% of (Multiplied Market Value + Asset Value)
 *    [Section 30(1)]
 *
 * 4. Additional Interest: 12% per annum on market value
 *    from date of Section 11 notification to date of award,
 *    computed pro-rata by months (interestMonths / 12).
 *    [Section 30(3)]
 *
 * 5. Value of Assets: Trees, standing crops, buildings, wells
 *    [Section 29]
 *
 * 6. R&R Grant: Second Schedule rehabilitation & resettlement entitlements
 *    [Second Schedule, Section 31]
 *
 * FORMULA:
 *   totalAward = multipliedLandValue + assetValue + solatium + interest + rrGrant
 *
 *   where:
 *     multipliedLandValue = baseLandValue × ruralMultiplier
 *     solatium            = 100% × (multipliedLandValue + assetValue)
 *     interest            = multipliedLandValue × 0.12 × (interestMonths / 12)
 */

/**
 * Calculate the rural distance multiplier per Section 26(1)(b).
 *
 * @param isRural - Whether the parcel is in a rural area
 * @param distanceFromUrbanKm - Distance from nearest notified urban boundary in km
 * @returns Multiplier factor between 1.00 and 2.00
 */
export function calculateRuralMultiplier(
  isRural: boolean,
  distanceFromUrbanKm: number
): number {
  // Section 26(1)(b): Urban parcels always get 1.0×
  if (!isRural) return 1.0;

  // Rural multiplier based on distance from urban boundary
  if (distanceFromUrbanKm <= 0) return 1.0;
  if (distanceFromUrbanKm <= 10) return 1.25;
  if (distanceFromUrbanKm <= 20) return 1.5;
  if (distanceFromUrbanKm <= 30) return 1.75;
  return 2.0;
}

/**
 * Compute the full RFCTLARR-2013 statutory compensation breakdown.
 *
 * @param input - Compensation parameters (market rate, area, location, assets, etc.)
 * @returns Full breakdown with every component and formatted total
 */
export function computeRFCTLARRCompensation(
  input: CompensationInput
): CompensationBreakdown {
  const solatiumPct = input.solatiumPercentage ?? 100; // Statutory default: 100%

  // Step 1: Base Land Value = Market Rate × Area
  // Section 26(1): Market rate is HIGHEST of circle rate, 3-yr sale deeds avg, or specified rate
  let effectiveMarketRate = input.baseMarketRatePerHa ?? 0;
  if (input.circleRatePerHa !== undefined || input.saleDeedAvgRatePerHa !== undefined) {
    const circle = input.circleRatePerHa ?? 0;
    const saleDeed = input.saleDeedAvgRatePerHa ?? 0;
    effectiveMarketRate = Math.max(circle, saleDeed, effectiveMarketRate);
  }

  const baseLandValueLakhs = effectiveMarketRate * input.areaHa;

  // Step 2: Rural Multiplier — Section 26(1)(b)
  const multiplierFactor = calculateRuralMultiplier(
    input.isRural,
    input.distanceFromUrbanKm
  );
  const multipliedLandValueLakhs = baseLandValueLakhs * multiplierFactor;

  // Step 3: Asset Value — Section 29
  // "value of things attached to the land or standing on it"
  const structureAndAssetsLakhs =
    input.structureValuationLakhs + input.treesCropsValuationLakhs;

  // Step 4: Solatium — Section 30(1)
  // "100% of the compensation amount" (applied to multiplied land value + assets)
  const solatiumLakhs =
    ((multipliedLandValueLakhs + structureAndAssetsLakhs) * solatiumPct) / 100;

  // Step 5: Additional Interest — Section 30(3)
  // "12% per annum on the market value" from Sec 11 notification to Award
  // Pro-rated by months: (marketValue × 0.12 × months / 12)
  const interest12PctLakhs =
    multipliedLandValueLakhs * 0.12 * (input.interestMonths / 12);

  // Step 6: Gross Compensation (before R&R)
  const grossCompensationLakhs =
    multipliedLandValueLakhs +
    structureAndAssetsLakhs +
    solatiumLakhs +
    interest12PctLakhs;

  // Step 7: R&R Grant — Second Schedule, Section 31
  const rehabilitationGrantLakhs = input.rehabilitationAssistanceLakhs;

  // Step 8: Total Payable
  const totalPayableLakhs = grossCompensationLakhs + rehabilitationGrantLakhs;

  // Format as Indian currency (₹ X.XX Lakhs)
  const currencyFormattedTotal = `₹ ${totalPayableLakhs.toFixed(2)} Lakhs`;

  return {
    baseLandValueLakhs: round2(baseLandValueLakhs),
    multiplierFactor,
    multipliedLandValueLakhs: round2(multipliedLandValueLakhs),
    solatiumLakhs: round2(solatiumLakhs),
    interest12PctLakhs: round2(interest12PctLakhs),
    structureAndAssetsLakhs: round2(structureAndAssetsLakhs),
    grossCompensationLakhs: round2(grossCompensationLakhs),
    rehabilitationGrantLakhs: round2(rehabilitationGrantLakhs),
    totalPayableLakhs: round2(totalPayableLakhs),
    currencyFormattedTotal,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
