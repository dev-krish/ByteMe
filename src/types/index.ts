export type StatutoryStage =
  | "SECTION_4_SIA"
  | "SECTION_6_SIA_APPROVAL"
  | "SECTION_9_SURVEY"
  | "SECTION_11_PRELIMINARY"
  | "SECTION_19_DECLARATION"
  | "SECTION_23_AWARD"
  | "SECTION_38_POSSESSION"
  | "COMPLETED";

export type ProjectStatus = "ON_TRACK" | "AT_RISK" | "SLA_BREACH" | "COMPLETED";

export interface Milestone {
  id: string;
  code: string;
  name: string;
  section: string;
  actReference: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "DELAYED";
  targetDate: string;
  completedDate?: string;
  officerInCharge: string;
  slaDays: number;
  remainingDays: number;
  documents: {
    name: string;
    type: string;
    url?: string;
    verified: boolean;
    gazetteNo?: string;
  }[];
}

export interface AcquisitionProject {
  id: string;
  code: string; // e.g. "NHAI-DEL-MUM-PKG4"
  title: string;
  sponsoringAgency: string; // e.g. "National Highways Authority of India"
  state: string;
  districts: string[];
  totalAreaHa: number;
  acquiredAreaHa: number;
  affectedVillagesCount: number;
  affectedFamiliesCount: number;
  sanctionedBudgetCr: number;
  disbursedCompensationCr: number;
  currentStage: StatutoryStage;
  stageProgress: number; // 0-100%
  status: ProjectStatus;
  slaWarning: boolean;
  slaDaysRemaining: number;
  startDate: string;
  targetCompletionDate: string;
  description: string;
  officerName: string;
  officerDesignation: string;
  milestones: Milestone[];
}

export interface CadastralParcel {
  id: string;
  khasraNo: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  areaHa: number;
  landUse: "AGRICULTURAL" | "COMMERCIAL" | "RESIDENTIAL" | "INDUSTRIAL" | "FOREST";
  soilClassification: "IRRIGATED" | "UNIRRIGATED" | "BARREN" | "WETLAND";
  ownerName: string;
  aadhaarLinked: boolean;
  panNo: string;
  circleRatePerHa: number;
  saleDeedAvgRatePerHa: number;
  surveyStatus: "VERIFIED" | "DISPUTED" | "PENDING_FIELD_VISIT";
  disputeNotes?: string;
  structuresCount: number;
  treesCount: number;
  coordinates: [number, number][]; // Lat/Lng polygon
  center: [number, number];
  acquisitionStage: StatutoryStage;
  compensationStatus: "PENDING_ASSESSMENT" | "AWARD_PUBLISHED" | "DISBURSED" | "ESCROW_LITIGATION";
  awardedAmountLakhs?: number;
}

export interface CompensationInput {
  baseMarketRatePerHa?: number; // Calculated or manual
  circleRatePerHa?: number; // Government circle / collector rate
  saleDeedAvgRatePerHa?: number; // Average of top 50% 3-year registered sale deeds
  areaHa: number;
  isRural: boolean;
  distanceFromUrbanKm: number; // Determines multiplier (1.0 to 2.0)
  structureValuationLakhs: number;
  treesCropsValuationLakhs: number;
  interestMonths: number; // 12% p.a. from Sec 4 to Award
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

export interface Beneficiary {
  id: string;
  name: string;
  khasraNo: string;
  village: string;
  bankAccountMasked: string;
  ifsc: string;
  totalAwardLakhs: number;
  disbursedLakhs: number;
  dbtStatus: "SUCCESS" | "PROCESSING" | "HOLD_DISPUTE" | "PENDING_KYC";
  utrNumber?: string;
  disbursedDate?: string;
}
