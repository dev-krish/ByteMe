import type { StatutorySection } from "@prisma/client";

/**
 * Workflow Finite State Machine — Camunda-Inspired, Data-Driven
 * =============================================================
 * Models the RFCTLARR Act 2013 statutory acquisition lifecycle
 * as a table-driven FSM with guard conditions.
 *
 * Each stage has:
 *   - next: the stage it transitions to (null = terminal)
 *   - slaDays: statutory SLA window
 *   - guards: conditions that must be met before transition
 *   - actReference: Act section citation
 *   - name: human-readable milestone name
 *
 * Guard Conditions:
 *   - ALL_OBJECTIONS_RESOLVED: no open Objection rows (Sec 15)
 *   - VALUATION_COMPLETE: all parcels have a Valuation row (Sec 23)
 *   - NO_DISPUTED_PARCELS: hard-block per Section 64 — disputed parcels
 *     cannot enter the disbursement stage
 *   - DBT_DISPATCHED: all valuations have a DBTTransaction
 *
 * NOTE: This is documented as "Camunda-inspired workflow engine,
 * built lightweight for the prototype." A production deployment
 * would use Camunda BPMN for multi-party orchestration.
 */

export type GuardCondition =
  | "ALL_OBJECTIONS_RESOLVED"
  | "VALUATION_COMPLETE"
  | "NO_DISPUTED_PARCELS"
  | "DBT_DISPATCHED";

export interface StageConfig {
  next: StatutorySection | null;
  slaDays: number;
  guards: GuardCondition[];
  actReference: string;
  name: string;
  milestoneCode: string;
}

/**
 * The statutory stage transition table.
 * Sequence: SEC_4 → SEC_6 → SEC_9 → SEC_11 → SEC_15 → SEC_19 → SEC_23 → SEC_30 → SEC_38
 */
export const STAGE_TRANSITIONS: Record<StatutorySection, StageConfig> = {
  SEC_4: {
    next: "SEC_6",
    slaDays: 60,
    guards: [],
    actReference: "RFCTLARR Act 2013, Sec 4(1) — Social Impact Assessment",
    name: "Social Impact Assessment (SIA)",
    milestoneCode: "SEC-4",
  },
  SEC_6: {
    next: "SEC_9",
    slaDays: 45,
    guards: [],
    actReference: "RFCTLARR Act 2013, Sec 6(2) — SIA Evaluation & Approval",
    name: "SIA Evaluation & Approval",
    milestoneCode: "SEC-6",
  },
  SEC_9: {
    next: "SEC_11",
    slaDays: 30,
    guards: [],
    actReference: "RFCTLARR Act 2013, Sec 9 — Survey of Land",
    name: "Survey of Land",
    milestoneCode: "SEC-9",
  },
  SEC_11: {
    next: "SEC_15",
    slaDays: 60,
    guards: [],
    actReference: "RFCTLARR Act 2013, Sec 11(1) — Preliminary Notification",
    name: "Preliminary Notification",
    milestoneCode: "SEC-11",
  },
  SEC_15: {
    next: "SEC_19",
    slaDays: 60,
    guards: ["ALL_OBJECTIONS_RESOLVED"],
    actReference: "RFCTLARR Act 2013, Sec 15 — Objection Hearing & Inquiry",
    name: "Objection Hearing & Inquiry",
    milestoneCode: "SEC-15",
  },
  SEC_19: {
    next: "SEC_23",
    slaDays: 90,
    guards: [],
    actReference: "RFCTLARR Act 2013, Sec 19 — Declaration of Acquisition",
    name: "Declaration of Acquisition",
    milestoneCode: "SEC-19",
  },
  SEC_23: {
    next: "SEC_30",
    slaDays: 60,
    guards: ["VALUATION_COMPLETE"],
    actReference: "RFCTLARR Act 2013, Sec 23 — Award Determination",
    name: "Award Determination",
    milestoneCode: "SEC-23",
  },
  SEC_30: {
    next: "SEC_38",
    slaDays: 30,
    guards: ["NO_DISPUTED_PARCELS", "DBT_DISPATCHED"],
    actReference: "RFCTLARR Act 2013, Sec 30 — Solatium & Interest Disbursement",
    name: "Solatium & Interest Disbursement",
    milestoneCode: "SEC-30",
  },
  SEC_38: {
    next: null,
    slaDays: 30,
    guards: [],
    actReference: "RFCTLARR Act 2013, Sec 38 — Possession of Land",
    name: "Possession of Land",
    milestoneCode: "SEC-38",
  },
};

/**
 * Get the ordered list of all stages in statutory sequence.
 */
export const STAGE_ORDER: StatutorySection[] = [
  "SEC_4",
  "SEC_6",
  "SEC_9",
  "SEC_11",
  "SEC_15",
  "SEC_19",
  "SEC_23",
  "SEC_30",
  "SEC_38",
];

/**
 * Map frontend StatutoryStage enum values to backend StatutorySection.
 */
export const FRONTEND_STAGE_MAP: Record<string, StatutorySection> = {
  SECTION_4_SIA: "SEC_4",
  SECTION_6_SIA_APPROVAL: "SEC_6",
  SECTION_9_SURVEY: "SEC_9",
  SECTION_11_PRELIMINARY: "SEC_11",
  SECTION_19_DECLARATION: "SEC_19",
  SECTION_23_AWARD: "SEC_23",
  SECTION_38_POSSESSION: "SEC_38",
  COMPLETED: "SEC_38",
};

/**
 * Map backend StatutorySection to frontend StatutoryStage string.
 */
export const BACKEND_STAGE_MAP: Record<StatutorySection, string> = {
  SEC_4: "SECTION_4_SIA",
  SEC_6: "SECTION_6_SIA_APPROVAL",
  SEC_9: "SECTION_9_SURVEY",
  SEC_11: "SECTION_11_PRELIMINARY",
  SEC_15: "SECTION_11_PRELIMINARY", // Sec 15 mapped to parent stage in frontend
  SEC_19: "SECTION_19_DECLARATION",
  SEC_23: "SECTION_23_AWARD",
  SEC_30: "SECTION_23_AWARD", // Sec 30 mapped to award stage in frontend
  SEC_38: "SECTION_38_POSSESSION",
};
