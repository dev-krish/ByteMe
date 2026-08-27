import { describe, it, expect } from "vitest";
import { sendOtp, verifyOtp } from "../src/services/auth.service.js";

describe("Citizen Aadhaar Authentication (UIDAI OTP)", () => {
  it("should dispatch UIDAI OTP for Aadhaar/Mobile identifiers", () => {
    const res = sendOtp("9829012345");
    expect(res.success).toBe(true);
    expect(res.message).toContain("UIDAI Aadhaar OTP");
    expect(res.demoOtp).toBe("123456");

    expect(verifyOtp("9829012345", "123456")).toBe(true);
  });

  it("should securely hash user passwords", async () => {
    const { hashPassword } = await import("../src/services/auth.service.js");
    const hash = await hashPassword("securePassword123");
    expect(hash).toBeTruthy();
    expect(hash).not.toBe("securePassword123");
    expect(hash.startsWith("$2")).toBe(true);
  });
});
