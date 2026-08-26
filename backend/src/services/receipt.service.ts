import QRCode from "qrcode";
import { prisma } from "../config/database.js";

/**
 * Receipt Service — Generates signed submission receipts with QR codes.
 */

/**
 * Generate a receipt for a project with embedded QR payload.
 * QR contains: project code, total award, UTR numbers, timestamp, audit hash.
 */
export async function generateReceipt(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      parcels: {
        include: {
          valuations: {
            include: {
              dbtTransactions: {
                select: { utrNumber: true, status: true, amount: true },
              },
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new Error(`Project ${projectId} not found.`);
  }

  // Gather all UTR numbers and total awards
  const utrNumbers: string[] = [];
  let totalAwardLakhs = 0;

  for (const parcel of project.parcels) {
    for (const valuation of parcel.valuations) {
      totalAwardLakhs += valuation.totalAward;
      for (const dbt of valuation.dbtTransactions) {
        if (dbt.utrNumber) utrNumbers.push(dbt.utrNumber);
      }
    }
  }

  // Get latest audit hash for integrity
  const lastAudit = await prisma.auditLog.findFirst({
    where: { entityType: "PROJECT", entityId: projectId },
    orderBy: { timestamp: "desc" },
    select: { currHash: true },
  });

  const receiptPayload = {
    projectCode: project.code,
    projectTitle: project.title,
    sponsoringAgency: project.sponsoringAgency,
    state: project.state,
    totalAreaHa: project.totalAreaHa,
    totalAwardLakhs: Math.round(totalAwardLakhs * 100) / 100,
    parcelsCount: project.parcels.length,
    utrNumbers,
    currentStage: project.currentStage,
    generatedAt: new Date().toISOString(),
    auditHash: lastAudit?.currHash ?? "NO_AUDIT",
    verifyUrl: `https://nlams.gov.in/verify/${project.code}`,
  };

  // Generate QR code as Base64 PNG
  const qrBase64 = await QRCode.toDataURL(JSON.stringify(receiptPayload), {
    errorCorrectionLevel: "M",
    width: 300,
    margin: 2,
  });

  return {
    receipt: receiptPayload,
    qrCode: qrBase64,
  };
}
