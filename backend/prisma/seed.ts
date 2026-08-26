import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { appendAuditLog } from "../src/services/audit.service.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create Users (RBAC Tiers)
  console.log("👤 Seeding users...");
  const passwordHash = await bcrypt.hash("nlams2026", 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "citizen@nlams.gov.in" },
      update: {},
      create: {
        name: "Rameshwar Prasad",
        email: "citizen@nlams.gov.in",
        passwordHash,
        role: "CITIZEN",
        aadhaarLinked: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "surveyor@nlams.gov.in" },
      update: {},
      create: {
        name: "Amit Patel",
        email: "surveyor@nlams.gov.in",
        passwordHash,
        role: "SURVEYOR",
        agency: "State Revenue Dept",
      },
    }),
    prisma.user.upsert({
      where: { email: "rajeshwar.cala@nic.in" },
      update: {},
      create: {
        name: "Rajeshwar Sharma, IAS",
        email: "rajeshwar.cala@nic.in",
        passwordHash,
        role: "CALA",
        designation: "Competent Authority for Land Acquisition",
        dscTokenSimulated: "CALA-DSC-TOKEN-1234",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@nlams.gov.in" },
      update: {},
      create: {
        name: "System Admin",
        email: "admin@nlams.gov.in",
        passwordHash,
        role: "ADMINISTRATOR",
      },
    }),
    prisma.user.upsert({
      where: { email: "ministry@nlams.gov.in" },
      update: {},
      create: {
        name: "Joint Secretary",
        email: "ministry@nlams.gov.in",
        passwordHash,
        role: "MINISTRY",
        agency: "Ministry of Rural Development",
      },
    }),
  ]);

  const calaUser = users.find((u) => u.role === "CALA")!;

  // 2. Create Project
  console.log("🏗️ Seeding project...");
  const project = await prisma.project.upsert({
    where: { code: "NHAI-DEL-MUM-PKG4" },
    update: {},
    create: {
      code: "NHAI-DEL-MUM-PKG4",
      title: "Delhi-Mumbai Expressway Corridor (Package 4)",
      sponsoringAgency: "National Highways Authority of India (NHAI)",
      state: "Rajasthan",
      districts: ["Dausa", "Sawai Madhopur"],
      totalAreaHa: 482.5,
      acquiredAreaHa: 412.0,
      affectedVillagesCount: 24,
      affectedFamiliesCount: 1420,
      sanctionedBudgetCr: 1240.0,
      disbursedCompensationCr: 980.5,
      currentStage: "SEC_23",
      stageProgress: 85,
      status: "ON_TRACK",
      slaDaysRemaining: 18,
      startDate: new Date("2023-04-10"),
      targetCompletionDate: new Date("2024-11-30"),
      description: "Land acquisition for 8-lane greenfield expressway segment passing through agricultural and non-forest revenue zones.",
      officerName: "Rajeshwar Sharma, IAS",
      officerDesignation: "Competent Authority for Land Acquisition (CALA)",
      createdById: calaUser.id,
    },
  });

  await appendAuditLog({
    entityType: "PROJECT",
    entityId: project.id,
    action: "CREATE",
    actorId: calaUser.id,
    payload: { code: project.code, title: project.title },
  });

  // 3. Create Workflow Stages
  console.log("📈 Seeding workflow stages...");
  const stagesData = [
    { section: "SEC_4", status: "COMPLETED", slaDays: 60, name: "Social Impact Assessment (SIA)", actReference: "RFCTLARR Act 2013, Sec 4(1)" },
    { section: "SEC_6", status: "COMPLETED", slaDays: 45, name: "SIA Evaluation & Approval", actReference: "RFCTLARR Act 2013, Sec 6(2)" },
    { section: "SEC_9", status: "COMPLETED", slaDays: 30, name: "Survey of Land", actReference: "RFCTLARR Act 2013, Sec 9" },
    { section: "SEC_11", status: "COMPLETED", slaDays: 60, name: "Preliminary Notification", actReference: "RFCTLARR Act 2013, Sec 11(1)" },
    { section: "SEC_15", status: "COMPLETED", slaDays: 60, name: "Objection Hearing & Inquiry", actReference: "RFCTLARR Act 2013, Sec 15" },
    { section: "SEC_19", status: "COMPLETED", slaDays: 90, name: "Declaration of Acquisition", actReference: "RFCTLARR Act 2013, Sec 19" },
    { section: "SEC_23", status: "IN_PROGRESS", slaDays: 60, name: "Award Determination", actReference: "RFCTLARR Act 2013, Sec 23" },
    { section: "SEC_30", status: "PENDING", slaDays: 30, name: "Solatium & Interest Disbursement", actReference: "RFCTLARR Act 2013, Sec 30" },
    { section: "SEC_38", status: "PENDING", slaDays: 30, name: "Possession of Land", actReference: "RFCTLARR Act 2013, Sec 38" },
  ];

  for (const stage of stagesData) {
    await prisma.workflowStage.upsert({
      where: {
        projectId_section: {
          projectId: project.id,
          section: stage.section as any,
        },
      },
      update: {},
      create: {
        projectId: project.id,
        section: stage.section as any,
        status: stage.status as any,
        slaDays: stage.slaDays,
        name: stage.name,
        actReference: stage.actReference,
        startedAt: new Date("2023-04-10"),
        completedAt: stage.status === "COMPLETED" ? new Date("2023-06-10") : null,
        completedById: stage.status === "COMPLETED" ? calaUser.id : null,
        slaDeadline: stage.status === "IN_PROGRESS" ? new Date(Date.now() + 18 * 24 * 60 * 60 * 1000) : null,
      },
    });
  }

  // 4. Create Parcels
  console.log("🗺️ Seeding parcels...");
  const parcel1Coords: [number, number][] = [
    [26.892, 76.331],
    [26.897, 76.335],
    [26.895, 76.342],
    [26.889, 76.338],
    [26.892, 76.331],
  ];

  const parcel1 = await prisma.parcel.create({
    data: {
      projectId: project.id,
      khasraNumber: "Plot 42A",
      village: "Ramgarh Revenue Ward 3",
      tehsil: "Dausa",
      district: "Dausa",
      state: "Rajasthan",
      areaHa: 2.45,
      landUse: "AGRICULTURAL",
      soilClassification: "IRRIGATED",
      ownerName: "Rameshwar Prasad Meena",
      aadhaarLinked: true,
      panNo: "ABCDE1234F",
      circleRatePerHa: 2200000,
      saleDeedAvgRatePerHa: 2650000,
      surveyStatus: "VERIFIED",
      structuresCount: 1,
      treesCount: 14,
      coordinatesJson: parcel1Coords,
      centerLat: 26.893,
      centerLng: 76.336,
      acquisitionStage: "SEC_23",
      compensationStatus: "DISBURSED",
      awardedAmountLakhs: 48.5,
    },
  });

  try {
    const geoJson = JSON.stringify({
      type: "Polygon",
      coordinates: [parcel1Coords.map(([lat, lng]) => [lng, lat])],
    });
    await prisma.$executeRawUnsafe(
      `UPDATE parcels SET geometry = ST_SetSRID(ST_GeomFromGeoJSON($1), 4326) WHERE id = $2`,
      geoJson,
      parcel1.id
    );
  } catch {
    console.warn("PostGIS skip for seed");
  }

  await appendAuditLog({
    entityType: "PARCEL",
    entityId: parcel1.id,
    action: "CREATE",
    actorId: calaUser.id,
    payload: { khasraNumber: parcel1.khasraNumber },
  });

  // 5. Create Valuation
  console.log("💰 Seeding valuations...");
  const valuation = await prisma.valuation.create({
    data: {
      parcelId: parcel1.id,
      baseMarketValue: 64.92,
      ruralMultiplier: 1.5,
      multipliedValue: 97.38,
      assetValue: 6.0,
      solatium: 103.38,
      interest: 11.68,
      interestMonths: 14,
      rrGrant: 5.0,
      totalAward: 223.44,
      signedByCala: true,
      signedAt: new Date(),
    },
  });

  await appendAuditLog({
    entityType: "VALUATION",
    entityId: valuation.id,
    action: "CREATE",
    actorId: calaUser.id,
    payload: { totalAward: valuation.totalAward },
  });

  // 6. Create DBT Transaction
  console.log("🏦 Seeding DBT transactions...");
  const dbt = await prisma.dBTTransaction.create({
    data: {
      valuationId: valuation.id,
      beneficiaryName: "Rameshwar Prasad Meena",
      beneficiaryAadhaarRef: "hashed-aadhaar-1",
      bankAccountMasked: "XXXX1234",
      ifsc: "SBIN0001234",
      utrNumber: "PFMS1679001234",
      status: "CREDITED",
      amount: 223.44,
      dispatchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      creditedAt: new Date(),
    },
  });

  await appendAuditLog({
    entityType: "DBT",
    entityId: dbt.id,
    action: "DBT_DISPATCH",
    actorId: calaUser.id,
    payload: { utrNumber: dbt.utrNumber, status: dbt.status },
  });

  console.log("✅ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
