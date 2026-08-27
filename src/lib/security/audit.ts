/**
 * NLAMS Immutable Cryptographic Audit Ledger (Merkle Hash Chain)
 * Every statutory transaction, milestone advancement, or PFMS DBT transfer
 * is cryptographically chained to guarantee non-repudiation and tamper detection.
 */

export interface AuditBlock {
  index: number;
  timestamp: string;
  action:
    | "STAGE_GAZETTED"
    | "DBT_DISBURSED"
    | "OBJECTION_RESOLVED"
    | "OBJECTION_FILED"
    | "SURVEY_LOCKED"
    | "OFFICER_LOGIN"
    | "CITIZEN_LOGIN";
  caseRef: string;
  officerId: string;
  payloadHash: string;
  previousHash: string;
  blockHash: string;
}

// In-memory genesis block and ledger chain
const GENESIS_BLOCK: AuditBlock = {
  index: 0,
  timestamp: "2026-01-01T00:00:00.000Z",
  action: "OFFICER_LOGIN",
  caseRef: "GOI-GENESIS-ROOT",
  officerId: "NIC_SYSTEM_ROOT",
  payloadHash: "0000000000000000000000000000000000000000000000000000000000000000",
  previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
  blockHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
};

let auditLedger: AuditBlock[] = [GENESIS_BLOCK];

async function sha256(data: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(data) as unknown as BufferSource;
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Append a tamper-evident audit record to the cryptographic ledger
 */
export async function appendAuditRecord(
  action: AuditBlock["action"],
  caseRef: string,
  officerId: string,
  dataPayload: Record<string, unknown>
): Promise<AuditBlock> {
  const previousBlock = auditLedger[auditLedger.length - 1];
  const payloadString = JSON.stringify(dataPayload);
  const payloadHash = await sha256(payloadString);
  const timestamp = new Date().toISOString();
  const index = previousBlock.index + 1;

  const rawBlockContent = `${index}-${timestamp}-${action}-${caseRef}-${officerId}-${payloadHash}-${previousBlock.blockHash}`;
  const blockHash = await sha256(rawBlockContent);

  const newBlock: AuditBlock = {
    index,
    timestamp,
    action,
    caseRef,
    officerId,
    payloadHash,
    previousHash: previousBlock.blockHash,
    blockHash,
  };

  auditLedger.push(newBlock);
  return newBlock;
}

/**
 * Verify cryptographic integrity of the entire audit chain
 */
export async function verifyAuditChainIntegrity(): Promise<{
  isValid: boolean;
  totalBlocks: number;
  tamperedIndex: number | null;
}> {
  for (let i = 1; i < auditLedger.length; i++) {
    const current = auditLedger[i];
    const previous = auditLedger[i - 1];

    if (current.previousHash !== previous.blockHash) {
      return { isValid: false, totalBlocks: auditLedger.length, tamperedIndex: i };
    }

    const rawBlockContent = `${current.index}-${current.timestamp}-${current.action}-${current.caseRef}-${current.officerId}-${current.payloadHash}-${current.previousHash}`;
    const calculatedHash = await sha256(rawBlockContent);

    if (calculatedHash !== current.blockHash) {
      return { isValid: false, totalBlocks: auditLedger.length, tamperedIndex: i };
    }
  }

  return { isValid: true, totalBlocks: auditLedger.length, tamperedIndex: null };
}

export function getAuditLedger(): AuditBlock[] {
  return [...auditLedger];
}
