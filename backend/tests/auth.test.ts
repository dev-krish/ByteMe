import { describe, it, expect } from "vitest";
import { sendOtp, verifyOtp } from "../src/services/auth.service.js";

describe("Citizen Dual-Channel Authentication (Aadhaar & Email)", () => {
  it("should dispatch UIDAI OTP for Aadhaar/Mobile identifiers", () => {
    const res = sendOtp("9829012345", "AADHAAR");
    expect(res.success).toBe(true);
    expect(res.channel).toBe("AADHAAR");
    expect(res.message).toContain("UIDAI Aadhaar OTP");
    expect(res.demoOtp).toBe("123456");

    expect(verifyOtp("9829012345", "123456")).toBe(true);
  });

  it("should dispatch Email Verification Code for Email identifiers", () => {
    const res = sendOtp("rameshwar.meena@citizen.gov.in", "EMAIL");
    expect(res.success).toBe(true);
    expect(res.channel).toBe("EMAIL");
    expect(res.message).toContain("Verification code dispatched to registered email");
    expect(res.demoOtp).toBe("123456");

    expect(verifyOtp("rameshwar.meena@citizen.gov.in", "123456")).toBe(true);
  });

  it("should auto-detect email channel when identifier contains @", () => {
    const res = sendOtp("citizen.user@nlams.gov.in");
    expect(res.channel).toBe("EMAIL");
    expect(res.message).toContain("Verification code");
  });

  it("should reject invalid OTP", () => {
    expect(verifyOtp("rameshwar.meena@citizen.gov.in", "999999")).toBe(false);
  });
});
