import crypto from "crypto";
import { prisma } from "../config/database.js";
import { appendAuditLog } from "./audit.service.js";

/**
 * DBT Service — Mock PFMS / e-Kuber Direct Benefit Transfer.
 *
 * NOTE: This is a simulated service. Real PFMS/e-Kuber integration
 * requires NIC's Payment Gateway API bridge. This mock:
 *   - Generates UTR numbers
 *   - Simulates async credit status progression
 *   - Enforces Section 64 disputed-parcel guard
 *
 * The interface is designed as a swappable adapter so production
 * can replace this with real PFMS calls.
 */

/**
 * Dispatch a DBT batch for a valuation.
 * Guards: refuses if any related parcel has DISPUTED title status (Sec 64).
 */
export async function dispatchDBT(
  valuationId: string,
  beneficiary: {
    name: string;
    aadhaarLast4: string;
    bankAccountMasked: string;
    ifsc: string;
  },
  actorId: string
) {
  // Check valuation exists and parcel isn't disputed
  const valuation = await prisma.valuation.findUnique({
    where: { id: valuationId },
    include: { parcel: { select: { titleStatus: true, khasraNumber: true } } },
  });

  if (!valuation) {
    throw new Error(`Valuation ${valuationId} not found.`);
  }

  // Section 64 guard: disputed parcels cannot receive disbursement
  if (valuation.parcel.titleStatus === "DISPUTED") {
    throw new Error(
      `HARD BLOCK (Section 64): Parcel ${valuation.parcel.khasraNumber} has DISPUTED ` +
        `title status. Resolve litigation before disbursement.`
    );
  }

  // Generate simulated UTR number
  const utr = `PFMS${Date.now().toString().slice(0, 10)}${Math.floor(
    Math.random() * 10000
  )
    .toString()
    .padStart(4, "0")}`;

  // Hash the Aadhaar reference for privacy
  const aadhaarHash = crypto
    .createHash("sha256")
    .update(beneficiary.aadhaarLast4)
    .digest("hex")
    .slice(0, 16);

  const transaction = await prisma.$transaction(async (tx) => {
    const dbt = await tx.dBTTransaction.create({
      data: {
        valuationId,
        beneficiaryName: beneficiary.name,
        beneficiaryAadhaarRef: aadhaarHash,
        bankAccountMasked: beneficiary.bankAccountMasked,
        ifsc: beneficiary.ifsc,
        utrNumber: utr,
        status: "QUEUED",
        amount: valuation.totalAward,
      },
    });

    await appendAuditLog(
      {
        entityType: "DBT",
        entityId: dbt.id,
        action: "DBT_DISPATCH",
        actorId,
        payload: {
          valuationId,
          utrNumber: utr,
          amount: valuation.totalAward,
          beneficiary: beneficiary.name,
          status: "QUEUED",
        },
      },
      tx
    );

    return dbt;
  });

  // Simulate async status progression (QUEUED → DISPATCHED → CREDITED)
  // In production, this would be replaced by PFMS webhook callbacks
  simulateStatusProgression(transaction.id);

  return transaction;
}

/**
 * Get DBT transaction status.
 */
export async function getDBTStatus(transactionId: string) {
  return prisma.dBTTransaction.findUnique({
    where: { id: transactionId },
    include: {
      valuation: {
        select: { totalAward: true, parcel: { select: { khasraNumber: true } } },
      },
    },
  });
}

/**
 * Simulate async PFMS status progression.
 * QUEUED → DISPATCHED (after 3s) → CREDITED (after 5s more)
 */
function simulateStatusProgression(transactionId: string): void {
  // QUEUED → DISPATCHED after 3 seconds
  setTimeout(async () => {
    try {
      await prisma.dBTTransaction.update({
        where: { id: transactionId },
        data: {
          status: "DISPATCHED",
          dispatchedAt: new Date(),
        },
      });
      console.log(`💸 DBT ${transactionId}: QUEUED → DISPATCHED`);

      // DISPATCHED → CREDITED after 5 more seconds
      setTimeout(async () => {
        try {
          await prisma.dBTTransaction.update({
            where: { id: transactionId },
            data: {
              status: "CREDITED",
              creditedAt: new Date(),
            },
          });

          // Update parcel compensation status
          const dbt = await prisma.dBTTransaction.findUnique({
            where: { id: transactionId },
            include: { valuation: { select: { parcelId: true } } },
          });
          if (dbt) {
            await prisma.parcel.update({
              where: { id: dbt.valuation.parcelId },
              data: { compensationStatus: "DISBURSED" },
            });
          }

          console.log(`💸 DBT ${transactionId}: DISPATCHED → CREDITED`);
        } catch (e) {
          console.error(`DBT credit simulation error:`, e);
        }
      }, 5000);
    } catch (e) {
      console.error(`DBT dispatch simulation error:`, e);
    }
  }, 3000);
}
