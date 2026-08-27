import { NextResponse } from "next/server";
import { getAuditLedger, verifyAuditChainIntegrity } from "@/lib/security/audit";

export async function GET() {
  const integrity = await verifyAuditChainIntegrity();
  const ledger = getAuditLedger();

  return NextResponse.json({
    status: integrity.isValid ? "SECURE_IMMUTABLE_CHAIN" : "TAMPER_DETECTED",
    integrity,
    totalRecords: ledger.length,
    latestBlockHash: ledger[ledger.length - 1]?.blockHash,
    recentAuditBlocks: ledger.slice(-10).reverse(),
  });
}
