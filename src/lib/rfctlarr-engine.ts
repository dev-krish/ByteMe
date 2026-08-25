import { CompensationInput, CompensationBreakdown } from "../types";

/**
 * RFCTLARR-2013 Statutory Compensation Engine
 * First Schedule (Section 26-30) of RFCTLARR Act 2013:
 * 1. Base Market Value = Max(Circle Rate, Avg 3 yrs Sale Deeds, Agreed amount) * Area
 * 2. Multiplier Factor:
 *    - Urban areas: 1.0
 *    - Rural areas: 1.00 to 2.00 depending on distance from nearest urban boundary:
 *        * 0 - 10 km: 1.25
 *        * 10 - 20 km: 1.50
 *        * 20 - 30 km: 1.75
 *        * > 30 km: 2.00
 * 3. Solatium: 100% of the multiplied land value + asset value (Section 30(1))
 * 4. Additional Interest: 12% per annum on market value (Section 30(3)) from Sec 4(2) notification to Award date.
 * 5. Value of Assets attached to land (Trees, standing crops, buildings, wells).
 * 6. Second Schedule: Rehabilitation & Resettlement (R&R) entitlements.
 */

export function calculateRuralMultiplier(isRural: boolean, distanceFromUrbanKm: number): number {
  if (!isRural) return 1.0;
  if (distanceFromUrbanKm <= 0) return 1.0;
  if (distanceFromUrbanKm <= 10) return 1.25;
  if (distanceFromUrbanKm <= 20) return 1.5;
  if (distanceFromUrbanKm <= 30) return 1.75;
  return 2.0;
}

export function computeRFCTLARRCompensation(input: CompensationInput): CompensationBreakdown {
  const baseLandValueLakhs = (input.baseMarketRatePerHa * input.areaHa) / 100000; // Convert to Lakhs if rate in INR, or assume direct
  // Normalized computation
  const normalizedBaseValueLakhs = input.baseMarketRatePerHa * input.areaHa;
  
  const multiplierFactor = calculateRuralMultiplier(input.isRural, input.distanceFromUrbanKm);
  const multipliedLandValueLakhs = normalizedBaseValueLakhs * multiplierFactor;

  // Assets (Structure, wells, trees)
  const structureAndAssetsLakhs = (input.structureValuationLakhs || 0) + (input.treesCropsValuationLakhs || 0);

  // Solatium = 100% of (Multiplied Land Value + Assets)
  const solatiumPercentage = input.solatiumPercentage ?? 100;
  const solatiumLakhs = (multipliedLandValueLakhs + structureAndAssetsLakhs) * (solatiumPercentage / 100);

  // 12% p.a. interest on Market Value for duration (months / 12)
  const interestYears = (input.interestMonths || 0) / 12;
  const interest12PctLakhs = multipliedLandValueLakhs * 0.12 * interestYears;

  const grossCompensationLakhs = multipliedLandValueLakhs + solatiumLakhs + interest12PctLakhs + structureAndAssetsLakhs;
  const rehabilitationGrantLakhs = input.rehabilitationAssistanceLakhs || 0;
  const totalPayableLakhs = grossCompensationLakhs + rehabilitationGrantLakhs;

  const formatCurrency = (valLakhs: number) => {
    if (valLakhs >= 100) {
      const cr = valLakhs / 100;
      return `₹${cr.toFixed(2)} Cr`;
    }
    return `₹${valLakhs.toFixed(2)} Lakhs`;
  };

  return {
    baseLandValueLakhs: Number(normalizedBaseValueLakhs.toFixed(2)),
    multiplierFactor,
    multipliedLandValueLakhs: Number(multipliedLandValueLakhs.toFixed(2)),
    solatiumLakhs: Number(solatiumLakhs.toFixed(2)),
    interest12PctLakhs: Number(interest12PctLakhs.toFixed(2)),
    structureAndAssetsLakhs: Number(structureAndAssetsLakhs.toFixed(2)),
    grossCompensationLakhs: Number(grossCompensationLakhs.toFixed(2)),
    rehabilitationGrantLakhs: Number(rehabilitationGrantLakhs.toFixed(2)),
    totalPayableLakhs: Number(totalPayableLakhs.toFixed(2)),
    currencyFormattedTotal: formatCurrency(totalPayableLakhs),
  };
}
