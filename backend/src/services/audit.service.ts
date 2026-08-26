import crypto from "crypto";
import { prisma } from "../config/database.js";
import { Prisma } from "@prisma/client";
import type { AuditLog } from "@prisma/client";

/**
 * Audit Service — SHA-256 hash-chained, append-only audit trail.
 *
 * Every mutation to project/parcel/valuation/workflow/dbt state writes
 * an AuditLog entry in the same transaction. The hash chain ensures
 * tamper-evidence: modifying any historical entry breaks the chain.
 *
 * Hash computation:
 *   currHash = SHA-256(prevHash + JSON.stringify(payload) + timestamp)
 *
 * The first entry for an entity uses prevHash = "GENESIS".
 */

interface AuditInput {
  entityType: string; // "PROJECT" | "PARCEL" | "VALUATION" | "WORKFLOW" | "DBT"
  entityId: string;
  action: string; // "CREATE" | "UPDATE" | "STAGE_ADVANCE" | "SLA_BREACH" | "DBT_DISPATCH" | "DSC_SIGN"
  actorId: string | null;
  payload: Record<string, unknown>;
}

/**
 * Append a new audit log entry with SHA-256 hash chaining.
 * Should be called within the same Prisma transaction as the mutation.
 */
export async function appendAuditLog(
  input: AuditInput,
  tx?: Prisma.TransactionClient
): Promise<AuditLog> {
  const client = tx || prisma;

  // 1. Find the last audit entry for this entity to get prevHash
  const lastEntry = await client.auditLog.findFirst({
    where: {
      entityType: input.entityType,
      entityId: input.entityId,
    },
    orderBy: { timestamp: "desc" },
    select: { currHash: true },
  });

  const prevHash = lastEntry?.currHash ?? "GENESIS";
  const timestamp = new Date();
  const payloadStr = JSON.stringify(input.payload);

  // 2. Compute SHA-256(prevHash + payload + timestamp)
  const hashInput = `${prevHash}${payloadStr}${timestamp.toISOString()}`;
  const currHash = crypto.createHash("sha256").update(hashInput).digest("hex");

  // 3. Insert the audit entry
  const auditLog = await client.auditLog.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actorId: input.actorId,
      prevHash,
      currHash,
      payloadSnapshot: input.payload as any,
      timestamp,
    },
  });

  return auditLog;
}

/**
 * Retrieve and verify the hash chain for an entity.
 * Returns the chain with a `verified` flag per entry.
 */
export async function getAuditChain(
  entityType: string,
  entityId: string
): Promise<Array<AuditLog & { verified: boolean }>> {
  const entries = await prisma.auditLog.findMany({
    where: { entityType, entityId },
    orderBy: { timestamp: "asc" },
    include: { actor: { select: { name: true, role: true } } },
  });

  if (entries.length === 0) return [];

  const result: Array<AuditLog & { verified: boolean }> = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    let verified = false;

    if (i === 0) {
      // First entry: prevHash should be "GENESIS"
      verified = entry.prevHash === "GENESIS";
    } else {
      // Subsequent entries: prevHash should match previous entry's currHash
      verified = entry.prevHash === entries[i - 1].currHash;
    }

    // Also verify the hash computation itself
    if (verified) {
      const payloadStr = JSON.stringify(entry.payloadSnapshot);
      const hashInput = `${entry.prevHash}${payloadStr}${entry.timestamp.toISOString()}`;
      const expectedHash = crypto
        .createHash("sha256")
        .update(hashInput)
        .digest("hex");
      verified = expectedHash === entry.currHash;
    }

    result.push({ ...entry, verified });
  }

  return result;
}
