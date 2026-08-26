import { describe, it, expect } from "vitest";
import { computeRFCTLARRCompensation } from "../src/engine/rfctlarr-calculator.js";

describe("RFCTLARR Valuation Engine", () => {
  it("should calculate correct compensation for an urban parcel", () => {
    const input = {
      baseMarketRatePerHa: 50,
      areaHa: 2,
      isRural: false,
      distanceFromUrbanKm: 0,
      structureValuationLakhs: 10,
      treesCropsValuationLakhs: 5,
      interestMonths: 12,
      rehabilitationAssistanceLakhs: 20,
    };

    const result = computeRFCTLARRCompensation(input);

    expect(result.baseLandValueLakhs).toBe(100);
    expect(result.multiplierFactor).toBe(1.0);
    expect(result.multipliedLandValueLakhs).toBe(100);
    expect(result.structureAndAssetsLakhs).toBe(15);
    expect(result.solatiumLakhs).toBe(115); // 100% of (100 + 15)
    expect(result.interest12PctLakhs).toBe(12); // 12% of 100 for 1 year
    expect(result.grossCompensationLakhs).toBe(100 + 15 + 115 + 12);
    expect(result.rehabilitationGrantLakhs).toBe(20);
    expect(result.totalPayableLakhs).toBe(242 + 20);
  });

  it("should calculate correct compensation for a rural parcel (>30km)", () => {
    const input = {
      baseMarketRatePerHa: 10,
      areaHa: 5,
      isRural: true,
      distanceFromUrbanKm: 35,
      structureValuationLakhs: 0,
      treesCropsValuationLakhs: 0,
      interestMonths: 6,
      rehabilitationAssistanceLakhs: 0,
    };

    const result = computeRFCTLARRCompensation(input);

    expect(result.baseLandValueLakhs).toBe(50);
    expect(result.multiplierFactor).toBe(2.0);
    expect(result.multipliedLandValueLakhs).toBe(100);
    expect(result.solatiumLakhs).toBe(100);
    expect(result.interest12PctLakhs).toBe(6); // 12% of 100 for 0.5 years
    expect(result.totalPayableLakhs).toBe(206);
  });
});
