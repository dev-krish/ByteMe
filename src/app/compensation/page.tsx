"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useState, useMemo } from "react";
import { computeRFCTLARRCompensation } from "@/lib/rfctlarr-engine";
import { MOCK_BENEFICIARIES } from "@/lib/data/mock-projects";
import {
  Calculator,
  CircleDollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Receipt,
  Download,
  Building2,
} from "lucide-react";

export default function CompensationPage() {
  // Calculator state
  const [baseMarketRate, setBaseMarketRate] = useState<number>(24.5); // in Lakhs per Ha
  const [areaHa, setAreaHa] = useState<number>(2.45);
  const [isRural, setIsRural] = useState<boolean>(true);
  const [distanceKm, setDistanceKm] = useState<number>(14);
  const [structureValuation, setStructureValuation] = useState<number>(4.2);
  const [treesValuation, setTreesValuation] = useState<number>(1.8);
  const [interestMonths, setInterestMonths] = useState<number>(14); // from Sec 4 to Award
  const [rehabGrant, setRehabGrant] = useState<number>(5.0); // R&R one-time grant

  const calculation = useMemo(() => {
    return computeRFCTLARRCompensation({
      baseMarketRatePerHa: baseMarketRate,
      areaHa: areaHa,
      isRural: isRural,
      distanceFromUrbanKm: distanceKm,
      structureValuationLakhs: structureValuation,
      treesCropsValuationLakhs: treesValuation,
      interestMonths: interestMonths,
      rehabilitationAssistanceLakhs: rehabGrant,
    });
  }, [
    baseMarketRate,
    areaHa,
    isRural,
    distanceKm,
    structureValuation,
    treesValuation,
    interestMonths,
    rehabGrant,
  ]);

  const [beneficiaries, setBeneficiaries] = useState(MOCK_BENEFICIARIES);
  const [dbtSuccessMsg, setDbtSuccessMsg] = useState<string | null>(null);

  const handleTriggerDBT = (id: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              dbtStatus: "SUCCESS",
              disbursedLakhs: b.totalAwardLakhs,
              utrNumber: `PFMS${Date.now().toString().slice(0, 10)}`,
              disbursedDate: new Date().toISOString().split("T")[0],
            }
          : b
      )
    );
    setDbtSuccessMsg("PFMS / e-Kuber DBT transaction signed and queued!");
    setTimeout(() => setDbtSuccessMsg(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-surface-container-high px-2 py-0.5 rounded text-primary border border-outline-variant/30">
                RFCTLARR-2013 Valuation Engine
              </span>
              <span className="text-xs font-mono text-emphasis">
                First & Second Schedule Compliance
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-sans">
              Statutory Compensation & R&R Disbursements
            </h1>
            <p className="text-xs text-emphasis mt-0.5">
              Live RFCTLARR statutory award calculator with rural distance multipliers (1.0 - 2.0x), 100% Solatium, and PFMS DBT ledger.
            </p>
          </div>

          {/* Toast Message */}
          {dbtSuccessMsg && (
            <div className="mb-6 p-3 rounded-xl bg-success-green/15 border border-success-green/30 text-success-green text-xs font-mono flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{dbtSuccessMsg}</span>
            </div>
          )}

          {/* Top Section: Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Calculator Input Form */}
            <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-outline-variant/40">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/20">
                <h2 className="text-sm font-bold text-on-surface font-sans flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-primary" />
                  <span>Statutory Formula Parameters</span>
                </h2>
                <span className="text-[10px] font-mono text-emphasis">Sec 26-30</span>
              </div>

              <div className="space-y-3.5 text-xs font-mono">
                {/* Base Rate */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-emphasis font-semibold">
                      Base Market Rate (₹ Lakhs / Ha):
                    </label>
                    <span className="font-bold text-primary">₹{baseMarketRate} L/Ha</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="0.5"
                    value={baseMarketRate}
                    onChange={(e) => setBaseMarketRate(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* Area Extent */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-emphasis font-semibold">
                      Area Extent (Hectares):
                    </label>
                    <span className="font-bold text-primary">{areaHa} Ha</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.05"
                    value={areaHa}
                    onChange={(e) => setAreaHa(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                {/* Rural Multiplier toggle & distance */}
                <div className="p-3 bg-surface-container-high/60 rounded-xl border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emphasis font-semibold">Land Location Type:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRural(false)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          !isRural
                            ? "bg-primary text-white"
                            : "bg-surface-container text-emphasis"
                        }`}
                      >
                        Urban (1.0x)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRural(true)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          isRural
                            ? "bg-primary text-white"
                            : "bg-surface-container text-emphasis"
                        }`}
                      >
                        Rural (Multiplier)
                      </button>
                    </div>
                  </div>

                  {isRural && (
                    <div className="pt-2 border-t border-outline-variant/20">
                      <div className="flex justify-between mb-1">
                        <span className="text-emphasis">Distance from Urban Boundary:</span>
                        <span className="font-bold text-primary">{distanceKm} km (Factor: {calculation.multiplierFactor}x)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="40"
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Assets (Structures + Trees) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emphasis mb-1">Structures Valuation (₹ L):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={structureValuation}
                      onChange={(e) => setStructureValuation(Number(e.target.value))}
                      className="solarized-input w-full p-2 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-emphasis mb-1">Trees & Crops (₹ L):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={treesValuation}
                      onChange={(e) => setTreesValuation(Number(e.target.value))}
                      className="solarized-input w-full p-2 rounded-lg font-bold"
                    />
                  </div>
                </div>

                {/* Additional Interest & R&R Grant */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emphasis mb-1">Interest Duration (Months @12%):</label>
                    <input
                      type="number"
                      value={interestMonths}
                      onChange={(e) => setInterestMonths(Number(e.target.value))}
                      className="solarized-input w-full p-2 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-emphasis mb-1">R&R Assistance Grant (₹ L):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={rehabGrant}
                      onChange={(e) => setRehabGrant(Number(e.target.value))}
                      className="solarized-input w-full p-2 rounded-lg font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Calculation Award Breakdown Card */}
            <div className="lg:col-span-6 glass-card rounded-2xl p-6 border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/20">
                  <h2 className="text-sm font-bold text-on-surface font-sans flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-primary" />
                    <span>Statutory Award Breakdown</span>
                  </h2>
                  <span className="text-[10px] font-mono text-success-green font-bold bg-success-green/10 px-2 py-0.5 rounded">
                    RFCTLARR First Schedule
                  </span>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-emphasis">Base Land Value (Rate × Area):</span>
                    <span className="font-semibold text-on-surface">₹{calculation.baseLandValueLakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-emphasis">Rural Multiplier Factor:</span>
                    <span className="font-bold text-secondary">{calculation.multiplierFactor}x</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-emphasis">Multiplied Market Value (A):</span>
                    <span className="font-bold text-on-surface">₹{calculation.multipliedLandValueLakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-emphasis">Structure & Asset Valuation (B):</span>
                    <span className="font-semibold text-on-surface">₹{calculation.structureAndAssetsLakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-emphasis">Statutory 100% Solatium (Sec 30(1)):</span>
                    <span className="font-bold text-primary">₹{calculation.solatiumLakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-emphasis">Additional 12% p.a. Interest (Sec 30(3)):</span>
                    <span className="font-semibold text-on-surface">₹{calculation.interest12PctLakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/15">
                    <span className="text-emphasis">Rehabilitation & Resettlement Grant:</span>
                    <span className="font-semibold text-on-surface">₹{calculation.rehabilitationGrantLakhs} Lakhs</span>
                  </div>
                </div>
              </div>

              {/* Total Payable Box */}
              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="text-[11px] font-mono uppercase text-emphasis font-semibold">
                  Final Statutory Award Total
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl md:text-3xl font-bold font-mono text-primary">
                    ₹{calculation.totalPayableLakhs} Lakhs
                  </span>
                  <span className="text-xs font-mono font-bold text-emphasis">
                    ({calculation.currencyFormattedTotal})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary Ledger & DBT Dispatch */}
          <div className="glass-card rounded-2xl p-6 border border-outline-variant/40">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/20">
              <div>
                <h3 className="text-sm font-bold text-on-surface font-sans">
                  Direct Benefit Transfer (DBT) Beneficiary Ledger
                </h3>
                <p className="text-xs text-emphasis mt-0.5">
                  Direct PFMS / e-Kuber payment gateway integration for Aadhaar-linked accounts.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-emphasis">
                    <th className="pb-3 font-semibold">Beneficiary Name</th>
                    <th className="pb-3 font-semibold">Khasra / Village</th>
                    <th className="pb-3 font-semibold">Bank Account</th>
                    <th className="pb-3 font-semibold">Total Award</th>
                    <th className="pb-3 font-semibold">DBT Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {beneficiaries.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="py-3 font-bold text-on-surface">
                        {b.name}
                      </td>
                      <td className="py-3 text-emphasis">
                        Plot {b.khasraNo} ({b.village})
                      </td>
                      <td className="py-3 text-on-surface">
                        {b.bankAccountMasked} ({b.ifsc})
                      </td>
                      <td className="py-3 font-bold text-primary">
                        ₹{b.totalAwardLakhs} Lakhs
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.dbtStatus === "SUCCESS"
                              ? "bg-success-green/15 text-success-green border border-success-green/30"
                              : b.dbtStatus === "PROCESSING"
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "bg-danger/15 text-danger border border-danger/30"
                          }`}
                        >
                          {b.dbtStatus}
                        </span>
                        {b.utrNumber && (
                          <div className="text-[10px] text-emphasis mt-0.5">
                            UTR: {b.utrNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {b.dbtStatus !== "SUCCESS" && b.dbtStatus !== "HOLD_DISPUTE" ? (
                          <button
                            onClick={() => handleTriggerDBT(b.id)}
                            className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded text-[11px] font-bold transition-all shadow-sm"
                          >
                            Sign & Disburse
                          </button>
                        ) : b.dbtStatus === "HOLD_DISPUTE" ? (
                          <span className="text-[11px] text-danger font-bold">
                            Stayed by Court
                          </span>
                        ) : (
                          <span className="text-[11px] text-success-green font-bold">
                            Disbursed ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
