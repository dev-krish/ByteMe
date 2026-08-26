import { describe, it, expect } from "vitest";
import { STAGE_TRANSITIONS, STAGE_ORDER } from "../src/engine/workflow-fsm.js";

describe("Workflow FSM Config", () => {
  it("should have correct stage order sequence", () => {
    expect(STAGE_ORDER[0]).toBe("SEC_4");
    expect(STAGE_ORDER[STAGE_ORDER.length - 1]).toBe("SEC_38");
  });

  it("should have correct statutory SLA days", () => {
    expect(STAGE_TRANSITIONS.SEC_4.slaDays).toBe(60);
    expect(STAGE_TRANSITIONS.SEC_15.slaDays).toBe(60);
    expect(STAGE_TRANSITIONS.SEC_19.slaDays).toBe(90);
  });

  it("should enforce Section 64 hard-block guard on Section 30", () => {
    const sec30Config = STAGE_TRANSITIONS.SEC_30;
    expect(sec30Config.guards).toContain("NO_DISPUTED_PARCELS");
  });

  it("should enforce objection resolution on Section 15", () => {
    const sec15Config = STAGE_TRANSITIONS.SEC_15;
    expect(sec15Config.guards).toContain("ALL_OBJECTIONS_RESOLVED");
  });
});
