"use client";

import { useState } from "react";
import { X, Printer, ShieldCheck, QrCode, CheckCircle2, FileText, ScrollText, BadgeCheck, ShieldAlert } from "lucide-react";
import { CompensationBreakdown } from "@/types";

type DocumentTab = "FORM_7" | "SEC_11" | "SEC_19" | "SEC_38";

interface AwardDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  khasraNo: string;
  village: string;
  ownerName: string;
  areaHa: number;
  circleRate: number;
  saleDeedRate: number;
  isRural: boolean;
  distanceKm: number;
  calculation: CompensationBreakdown;
  officerName?: string;
  officerDesignation?: string;
}

export default function AwardDossierModal({
  isOpen,
  onClose,
  khasraNo,
  village,
  ownerName,
  areaHa,
  circleRate,
  saleDeedRate,
  isRural,
  distanceKm,
  calculation,
  officerName = "Rajeshwar Sharma, GAS",
  officerDesignation = "Competent Authority for Land Acquisition (CALA) & Deputy Collector",
}: AwardDossierModalProps) {
  const [activeTab, setActiveTab] = useState<DocumentTab>("FORM_7");

  if (!isOpen) return null;

  const awardRefNumber = `RFCTLARR/RJ/DAU/${khasraNo.replace(/[^a-zA-Z0-9]/g, "")}/${new Date().getFullYear()}`;
  const gazetteNumber = `RAJ-GAZ-EXT-${new Date().getFullYear()}-4491`;
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#fdf6e3] text-[#071e25] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#657b83]/30 overflow-hidden flex flex-col my-8">
        {/* Modal Toolbar (hidden during print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 bg-[#eee8d5] border-b border-[#657b83]/20 print:hidden gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase bg-[#006098]/15 text-[#006098] px-2 py-0.5 rounded">
              Statutory Gazette Suite
            </span>
            <span className="text-xs font-mono text-[#586e75]">RFCTLARR Act 2013</span>
          </div>

          {/* Document Tab Switcher */}
          <div className="flex items-center gap-1 bg-[#fdf6e3] p-1 rounded-lg border border-[#657b83]/20 text-[11px] font-mono font-bold">
            <button
              onClick={() => setActiveTab("FORM_7")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "FORM_7"
                  ? "bg-[#006098] text-white shadow-sm"
                  : "text-[#586e75] hover:text-[#071e25]"
              }`}
            >
              Form 7 Award
            </button>
            <button
              onClick={() => setActiveTab("SEC_11")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "SEC_11"
                  ? "bg-[#006098] text-white shadow-sm"
                  : "text-[#586e75] hover:text-[#071e25]"
              }`}
            >
              Sec 11 Gazette
            </button>
            <button
              onClick={() => setActiveTab("SEC_19")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "SEC_19"
                  ? "bg-[#006098] text-white shadow-sm"
                  : "text-[#586e75] hover:text-[#071e25]"
              }`}
            >
              Sec 19 Declaration
            </button>
            <button
              onClick={() => setActiveTab("SEC_38")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "SEC_38"
                  ? "bg-[#006098] text-white shadow-sm"
                  : "text-[#586e75] hover:text-[#071e25]"
              }`}
            >
              Sec 38 Possession
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#006098] hover:bg-[#006098]/90 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#586e75] hover:text-[#071e25] hover:bg-[#657b83]/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Award Dossier Content */}
        <div className="p-8 sm:p-10 space-y-6 font-serif leading-relaxed">
          {/* Header */}
          <div className="text-center border-b-2 border-[#071e25] pb-4 space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-[#586e75]">
              GOVERNMENT OF RAJASTHAN • REVENUE DEPARTMENT
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-sans uppercase">
              OFFICE OF THE COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
            </h2>
            <p className="text-xs font-mono font-semibold text-[#006098]">
              DISTRICT COLLECTORATE, DAUSA REVENUE DIVISION
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 border border-[#071e25] text-xs font-mono font-bold uppercase tracking-wider">
              {activeTab === "FORM_7" && "FORM 7 — NOTICE OF STATUTORY AWARD (SECTIONS 23, 26 & 30)"}
              {activeTab === "SEC_11" && "EXTRAORDINARY GAZETTE NOTIFICATION UNDER SECTION 11(1)"}
              {activeTab === "SEC_19" && "FINAL DECLARATION OF ACQUISITION & R&R SCHEME UNDER SECTION 19(1)"}
              {activeTab === "SEC_38" && "CERTIFICATE OF PHYSICAL POSSESSION UNDER SECTION 38"}
            </div>
          </div>

          {/* Reference Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-[#eee8d5]/60 p-3.5 rounded-xl border border-[#657b83]/20">
            <div>
              <p className="text-[#586e75]">Reference Code:</p>
              <p className="font-bold text-[#006098] truncate">{awardRefNumber}</p>
            </div>
            <div>
              <p className="text-[#586e75]">Gazette No:</p>
              <p className="font-bold">{gazetteNumber}</p>
            </div>
            <div>
              <p className="text-[#586e75]">Parcel (Khasra):</p>
              <p className="font-bold">{khasraNo}, {village}</p>
            </div>
            <div>
              <p className="text-[#586e75]">Affected Person (PAP):</p>
              <p className="font-bold truncate">{ownerName}</p>
            </div>
          </div>

          {/* TAB 1: FORM 7 STATUTORY AWARD */}
          {activeTab === "FORM_7" && (
            <div className="space-y-4">
              <p className="text-xs text-justify">
                Whereas the land described in the schedule hereunder has been declared for acquisition for public purpose under Section 19 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR-2013). The Competent Authority, after due inquiry under Section 15 and determination of market rates under Section 26, hereby pronounces the statutory award.
              </p>

              {/* Statutory Calculation Schedule Table */}
              <div className="border border-[#657b83]/30 rounded-xl overflow-hidden">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-[#eee8d5] text-[#071e25] border-b border-[#657b83]/30">
                      <th className="p-2.5 text-left font-bold">Clause / Section</th>
                      <th className="p-2.5 text-left font-bold">Statutory Component</th>
                      <th className="p-2.5 text-right font-bold">Determined Value (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#657b83]/20">
                    <tr>
                      <td className="p-2.5 text-[#586e75]">Sec 26(1)</td>
                      <td className="p-2.5">
                        Base Land Value ({areaHa} Ha @ Max(Circle ₹{circleRate}L, Sale Deeds ₹{saleDeedRate}L))
                      </td>
                      <td className="p-2.5 text-right font-semibold">₹ {calculation.baseLandValueLakhs.toFixed(2)} Lakhs</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-[#586e75]">Sec 26(1)(b)</td>
                      <td className="p-2.5">
                        Rural Distance Multiplier ({isRural ? `${distanceKm} km from urban line` : "Urban"} &rarr; {calculation.multiplierFactor.toFixed(2)}&times;)
                      </td>
                      <td className="p-2.5 text-right font-semibold">₹ {calculation.multipliedLandValueLakhs.toFixed(2)} Lakhs</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-[#586e75]">Sec 29</td>
                      <td className="p-2.5">Valuation of Attached Assets (Structures, Trees, Wells)</td>
                      <td className="p-2.5 text-right font-semibold">₹ {calculation.structureAndAssetsLakhs.toFixed(2)} Lakhs</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-[#586e75]">Sec 30(1)</td>
                      <td className="p-2.5">Statutory 100% Solatium on (Multiplied Land + Assets)</td>
                      <td className="p-2.5 text-right font-semibold">₹ {calculation.solatiumLakhs.toFixed(2)} Lakhs</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-[#586e75]">Sec 30(3)</td>
                      <td className="p-2.5">Additional Interest @ 12% p.a. (Sec 11 Notice to Award)</td>
                      <td className="p-2.5 text-right font-semibold">₹ {calculation.interest12PctLakhs.toFixed(2)} Lakhs</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-[#586e75]">Second Schedule</td>
                      <td className="p-2.5">Rehabilitation & Resettlement (R&R) One-Time Assistance</td>
                      <td className="p-2.5 text-right font-semibold">₹ {calculation.rehabilitationGrantLakhs.toFixed(2)} Lakhs</td>
                    </tr>
                    <tr className="bg-[#006098]/10 font-bold text-[#006098]">
                      <td className="p-3">Sec 23 Total</td>
                      <td className="p-3">TOTAL STATUTORY PAYABLE COMPENSATION</td>
                      <td className="p-3 text-right text-sm">
                        {calculation.currencyFormattedTotal}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SECTION 11 PRELIMINARY GAZETTE NOTIFICATION */}
          {activeTab === "SEC_11" && (
            <div className="space-y-4 text-xs">
              <p className="text-justify">
                <strong>NOTIFICATION UNDER SECTION 11(1):</strong> It is hereby notified that land specified in the schedule below is likely to be needed for a public purpose, namely the construction of the National Infrastructure Corridor.
              </p>
              <div className="p-4 bg-[#eee8d5]/50 rounded-xl border border-[#657b83]/20 space-y-2 font-mono text-[11px]">
                <p><strong>1. Social Impact Assessment Sanction:</strong> Approved under Section 6(2) on 12-Nov-2022.</p>
                <p><strong>2. Freezing of Land Alienation:</strong> Under Section 11(4), no person shall make any transaction or cause any encumbrances on the notified land without prior sanction of Collector.</p>
                <p><strong>3. Statutory Objection Period:</strong> 60 days allowed under Section 15(1) for filing claims before the Competent Authority.</p>
              </div>
              <p className="text-justify">
                Authorized officers, Patwaris, and licensed GIS surveyors are empowered to enter upon, survey, take levels, and mark boundaries on Khasra {khasraNo}.
              </p>
            </div>
          )}

          {/* TAB 3: SECTION 19 DECLARATION & R&R SUMMARY */}
          {activeTab === "SEC_19" && (
            <div className="space-y-4 text-xs">
              <p className="text-justify">
                <strong>DECLARATION UNDER SECTION 19(1):</strong> The State Government, after reviewing the Social Impact Assessment and Objections Inquiry Report submitted under Section 15(2), declares that {areaHa} Hectares of land in {village} is required for public infrastructure commissioning.
              </p>
              <div className="p-4 bg-[#eee8d5]/50 rounded-xl border border-[#657b83]/20 space-y-2 font-mono text-[11px]">
                <p><strong>R&R Scheme Summary (Second Schedule Compliance):</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provision of housing entitlement / resettlement grant: ₹5.00 Lakhs sanctioned per PAF.</li>
                  <li>Subsistence grant for displaced agricultural families for 12 months.</li>
                  <li>One-time mandatory transport assistance for displacement.</li>
                </ul>
              </div>
              <p className="text-justify">
                A summary of the Rehabilitation & Resettlement Scheme has been published across the Panchayat Bhawan and District Collectorate website.
              </p>
            </div>
          )}

          {/* TAB 4: SECTION 38 LAWFUL PHYSICAL POSSESSION */}
          {activeTab === "SEC_38" && (
            <div className="space-y-4 text-xs">
              <p className="text-justify">
                <strong>CERTIFICATE OF PHYSICAL POSSESSION UNDER SECTION 38:</strong> The Collector / CALA certifies that the full compensation determined under Section 23 has been paid to the entitled persons or deposited into the District Escrow Ledger under Section 64 reference.
              </p>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <BadgeCheck className="w-4 h-4 text-emerald-700" />
                  <span>ENCUMBRANCE-FREE TITLE TRANSFERRED</span>
                </div>
                <p>Physical possession of Khasra {khasraNo} ({areaHa} Ha) has been lawfully handed over to the Sponsoring Infrastructure Agency.</p>
                <p>Revenue mutation entries (DILRMP Record of Rights) ordered to reflect Government Ownership.</p>
              </div>
            </div>
          )}

          {/* Cryptographic DSC Signature & Verification Section */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2 border-t border-[#657b83]/20">
            {/* QR Code */}
            <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-[#657b83]/20 shadow-sm text-center">
              <div className="w-20 h-20 bg-gray-900 rounded p-1 flex items-center justify-center text-white">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <span className="text-[9px] font-mono text-[#586e75] mt-1.5">Scan to Verify Gazette Hash</span>
            </div>

            {/* DSC Stamp */}
            <div className="sm:col-span-9 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-mono text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Class 3 Hardware DSC Cryptographically Signed</span>
              </div>
              <p><strong>Signed by:</strong> {officerName}</p>
              <p><strong>Designation:</strong> {officerDesignation}</p>
              <p className="text-[10px] text-emerald-700 truncate">
                <strong>SHA-256 Digest:</strong> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authenticated via India PKI Trust Chain (CCA India)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
