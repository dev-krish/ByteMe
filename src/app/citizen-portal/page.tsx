"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  UserCheck,
  ShieldCheck,
  MapPin,
  CircleDollarSign,
  FileCheck2,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Printer,
  QrCode,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  LogOut,
  ExternalLink,
  ChevronRight,
  Scale,
} from "lucide-react";

interface CitizenProfile {
  userId: string;
  name: string;
  email: string;
  role: string;
  userType: string;
  department?: string;
  state?: string;
  district?: string;
  village?: string;
  khasraNo?: string;
  aadhaarLast4?: string;
  phone?: string;
}

export default function CitizenPortalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"AWARDS" | "DBT" | "PARCEL" | "OBJECTION" | "RECEIPT">("AWARDS");

  // Section 15 Objection Form States
  const [objectionType, setObjectionType] = useState("COMPENSATION_RATE");
  const [objectionNotes, setObjectionNotes] = useState("");
  const [objectionSubmitted, setObjectionSubmitted] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login?redirect=/citizen-portal&reason=auth_required");
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user) {
          setProfile(data.user);
        } else {
          router.push("/login?redirect=/citizen-portal&reason=auth_required");
        }
      } catch {
        router.push("/login?redirect=/citizen-portal");
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const handleObjectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setObjectionSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center font-mono text-sm text-emphasis">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3"></div>
        <span>Verifying UIDAI Citizen Session...</span>
      </div>
    );
  }

  const name = profile?.name || "Rameshwar Prasad Meena";
  const khasraNo = profile?.khasraNo || "Plot 42A";
  const village = profile?.village || "Ramgarh Revenue Ward 3";
  const district = profile?.district || "Dausa";
  const state = profile?.state || "Rajasthan";
  const aadhaarLast4 = profile?.aadhaarLast4 || "4291";

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Top Citizen Header Banner */}
        <section className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                <UserCheck className="w-9 h-9" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold font-sans text-on-surface">
                    {name}
                  </h1>
                  <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Aadhaar Linked (•••• {aadhaarLast4})</span>
                  </span>
                  <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                    RFCTLARR Beneficiary
                  </span>
                </div>

                <p className="text-xs text-emphasis mt-1 flex items-center gap-2 flex-wrap font-sans">
                  <span>
                    <strong>Cadastral Parcel:</strong> {khasraNo}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Revenue Village:</strong> {village}, {district} ({state})
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Acquisition Corridor:</strong> NHAI Delhi-Mumbai Expressway (Pkg 4)
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start lg:self-center">
              <Link
                href="/thank-you"
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-xs font-mono text-primary font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Statutory e-Receipt</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-danger/10 hover:bg-danger/20 border border-danger/30 text-xs font-mono text-danger font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-outline-variant/30">
            <div className="p-3 bg-surface-container/60 rounded-2xl border border-outline-variant/30">
              <span className="text-[10px] font-mono uppercase text-emphasis font-bold block">
                Acquired Land Area
              </span>
              <span className="text-xl font-bold font-mono text-on-surface">2.45 Ha</span>
              <span className="text-[10px] text-emphasis block mt-0.5">Agricultural Multi-crop</span>
            </div>

            <div className="p-3 bg-surface-container/60 rounded-2xl border border-outline-variant/30">
              <span className="text-[10px] font-mono uppercase text-emphasis font-bold block">
                Total Award (Sec 23-30)
              </span>
              <span className="text-xl font-bold font-mono text-primary">₹223.44 L</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                100% Solatium Included
              </span>
            </div>

            <div className="p-3 bg-surface-container/60 rounded-2xl border border-outline-variant/30">
              <span className="text-[10px] font-mono uppercase text-emphasis font-bold block">
                PFMS Direct Transfer
              </span>
              <span className="text-xl font-bold font-mono text-success-green">Credited</span>
              <span className="text-[10px] text-emphasis block mt-0.5">Bank A/C: ••••1234</span>
            </div>

            <div className="p-3 bg-surface-container/60 rounded-2xl border border-outline-variant/30">
              <span className="text-[10px] font-mono uppercase text-emphasis font-bold block">
                Statutory Milestone
              </span>
              <span className="text-xl font-bold font-mono text-on-surface">Section 23</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                Award Signed by CALA
              </span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-outline-variant/30">
          <button
            onClick={() => setActiveTab("AWARDS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "AWARDS"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:bg-surface-container-high"
            }`}
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>Statutory Compensation (Sec 26–30)</span>
          </button>

          <button
            onClick={() => setActiveTab("DBT")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "DBT"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:bg-surface-container-high"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>PFMS DBT Payment Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab("PARCEL")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "PARCEL"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:bg-surface-container-high"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Cadastral Survey & Assets</span>
          </button>

          <button
            onClick={() => setActiveTab("OBJECTION")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "OBJECTION"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:bg-surface-container-high"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>File Section 15 Objection</span>
          </button>

          <button
            onClick={() => setActiveTab("RECEIPT")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === "RECEIPT"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:bg-surface-container-high"
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Signed e-Receipt & QR</span>
          </button>
        </div>

        {/* Tab 1: Compensation Breakdown */}
        {activeTab === "AWARDS" && (
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-on-surface">
                RFCTLARR Act 2013 Statutory Valuation Statement
              </h2>
              <p className="text-xs text-emphasis mt-1">
                Transparent multi-tier breakdown formulated strictly under Section 26 to 30 and the First Schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Breakdown Table */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-surface-container/60 rounded-xl flex justify-between items-center border border-outline-variant/30">
                  <div>
                    <span className="font-bold block text-on-surface">Base Market Value (Sec 26)</span>
                    <span className="text-[10px] text-emphasis">
                      Max(Circle Rate ₹22 L, 3-Yr Sale Deed ₹26.5 L) × 2.45 Ha
                    </span>
                  </div>
                  <span className="font-bold text-on-surface">₹64.92 Lakhs</span>
                </div>

                <div className="p-3 bg-surface-container/60 rounded-xl flex justify-between items-center border border-outline-variant/30">
                  <div>
                    <span className="font-bold block text-on-surface">Rural Multiplier Factor (Sec 26(1)(b))</span>
                    <span className="text-[10px] text-emphasis">
                      Distance 18 km from urban limits → 1.50x Factor
                    </span>
                  </div>
                  <span className="font-bold text-primary">₹97.38 Lakhs</span>
                </div>

                <div className="p-3 bg-surface-container/60 rounded-xl flex justify-between items-center border border-outline-variant/30">
                  <div>
                    <span className="font-bold block text-on-surface">Structure & Attached Assets (Sec 29)</span>
                    <span className="text-[10px] text-emphasis">
                      1 Farm Structure + 14 Fruit Bearing Trees
                    </span>
                  </div>
                  <span className="font-bold text-on-surface">₹6.00 Lakhs</span>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl flex justify-between items-center border border-emerald-500/30 text-emerald-900">
                  <div>
                    <span className="font-bold block">100% Solatium (Sec 30(1))</span>
                    <span className="text-[10px] text-emerald-800">
                      Mandatory statutory Solatium on (Multiplied Land + Assets)
                    </span>
                  </div>
                  <span className="font-bold text-emerald-800">₹103.38 Lakhs</span>
                </div>

                <div className="p-3 bg-surface-container/60 rounded-xl flex justify-between items-center border border-outline-variant/30">
                  <div>
                    <span className="font-bold block text-on-surface">12% p.a. Additional Interest (Sec 30(3))</span>
                    <span className="text-[10px] text-emphasis">
                      14 Months from Sec 4 SIA to Sec 23 Award
                    </span>
                  </div>
                  <span className="font-bold text-on-surface">₹11.68 Lakhs</span>
                </div>

                <div className="p-3 bg-surface-container/60 rounded-xl flex justify-between items-center border border-outline-variant/30">
                  <div>
                    <span className="font-bold block text-on-surface">R&R Grant (Second Schedule)</span>
                    <span className="text-[10px] text-emphasis">
                      One-time resettlement assistance grant
                    </span>
                  </div>
                  <span className="font-bold text-on-surface">₹5.00 Lakhs</span>
                </div>
              </div>

              {/* Right Final Award Summary Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-surface-container-high/80 to-surface-container border border-primary/30 flex flex-col justify-between shadow-md">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold block mb-1">
                    Final Certified Payable Amount
                  </span>
                  <div className="text-3xl md:text-4xl font-bold font-mono text-primary mb-3">
                    ₹ 2,23,44,000
                  </div>
                  <p className="text-xs text-emphasis leading-relaxed font-sans mb-4">
                    Two Crores Twenty-Three Lakhs Forty-Four Thousand Rupees only. Sanctioned and digitally signed under Competent Authority DSC token.
                  </p>

                  <div className="space-y-2 text-xs font-mono pt-4 border-t border-outline-variant/30">
                    <div className="flex justify-between">
                      <span className="text-emphasis">Signing Authority:</span>
                      <span className="font-bold text-on-surface">Rajeshwar Sharma, IAS (CALA)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emphasis">Digital Signature:</span>
                      <span className="font-bold text-success-green">Verified (Class 3 DSC)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emphasis">Gazette Notif:</span>
                      <span className="font-bold text-primary">DL-DAU-2024-8842-A</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-outline-variant/30 flex gap-2">
                  <button
                    onClick={() => setActiveTab("RECEIPT")}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-wider py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>View Award Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: DBT Payment Ledger */}
        {activeTab === "DBT" && (
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-on-surface">
                PFMS Direct Benefit Transfer (DBT) Status
              </h2>
              <p className="text-xs text-emphasis mt-1">
                Real-time bank disbursement tracking directly synchronized with the Public Financial Management System (PFMS).
              </p>
            </div>

            {/* Stepper tracker */}
            <div className="p-6 bg-surface-container/60 rounded-2xl border border-outline-variant/30">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono relative">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-success-green text-white flex items-center justify-center font-bold mb-2 shadow-sm">
                    ✓
                  </div>
                  <span className="font-bold text-success-green">DBT Queued</span>
                  <span className="text-[10px] text-emphasis">24 Aug 2026, 10:15 AM</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-success-green text-white flex items-center justify-center font-bold mb-2 shadow-sm">
                    ✓
                  </div>
                  <span className="font-bold text-success-green">RBI Clearing Dispatched</span>
                  <span className="text-[10px] text-emphasis">24 Aug 2026, 02:30 PM</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold mb-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-emerald-800">Bank Account Credited</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">25 Aug 2026, 11:04 AM</span>
                </div>
              </div>
            </div>

            {/* Banking Details Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-surface-container-high/60 rounded-2xl border border-outline-variant/30 space-y-2">
                <div className="text-[10px] text-emphasis uppercase font-bold">Beneficiary Account</div>
                <div className="text-sm font-bold text-on-surface">{name}</div>
                <div className="text-emphasis">State Bank of India (Dausa Branch)</div>
                <div className="text-emphasis">Account Number: <strong>••••••••1234</strong></div>
                <div className="text-emphasis">IFSC Code: <strong>SBIN0001234</strong></div>
              </div>

              <div className="p-4 bg-surface-container-high/60 rounded-2xl border border-outline-variant/30 space-y-2">
                <div className="text-[10px] text-emphasis uppercase font-bold">Transaction Authorization</div>
                <div className="text-sm font-bold text-primary">PFMS1679001234</div>
                <div className="text-emphasis">Settlement Type: <strong>PFMS DBT Direct Credit</strong></div>
                <div className="text-emphasis">Disbursed Amount: <strong className="text-emerald-700">₹2,23,44,000</strong></div>
                <div className="text-success-green font-semibold">Status: 100% Settled & Confirmed</div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Cadastral Survey & Parcel Details */}
        {activeTab === "PARCEL" && (
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-on-surface">
                Cadastral Survey Record & Field Inspection Dossier
              </h2>
              <p className="text-xs text-emphasis mt-1">
                Verified land attributes surveyed under Section 9 with GIS satellite boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-surface-container/60 rounded-2xl border border-outline-variant/30 space-y-2">
                <div className="text-[10px] text-emphasis uppercase font-bold">Land Attributes</div>
                <div>Khasra Number: <strong className="text-primary">{khasraNo}</strong></div>
                <div>Revenue Ward: <strong>Ward 3, Ramgarh</strong></div>
                <div>Tehsil / District: <strong>Dausa, Rajasthan</strong></div>
                <div>Survey Area: <strong>2.45 Hectares (6.05 Acres)</strong></div>
                <div>Land Use: <strong>Agricultural Irrigated</strong></div>
              </div>

              <div className="p-4 bg-surface-container/60 rounded-2xl border border-outline-variant/30 space-y-2">
                <div className="text-[10px] text-emphasis uppercase font-bold">Attached Property & Assets</div>
                <div>Residential / Farm Structures: <strong>1 Unit (Brick & Mortar)</strong></div>
                <div>Fruit Trees: <strong>14 Mature Mango & Guava Trees</strong></div>
                <div>Tube Well / Borewell: <strong>1 Solar-Powered Borewell</strong></div>
                <div>Surveyor Verification: <strong className="text-success-green">Verified on Field</strong></div>
              </div>

              <div className="p-4 bg-surface-container/60 rounded-2xl border border-outline-variant/30 space-y-2">
                <div className="text-[10px] text-emphasis uppercase font-bold">Title & Litigation Status</div>
                <div>Title Verification: <strong className="text-success-green">Clear Title (100% Freehold)</strong></div>
                <div>Pending Disputes: <strong>None (Zero Section 64 Stays)</strong></div>
                <div>Right-of-Way Buffer: <strong>60-Meter Corridor Applied</strong></div>
                <div>
                  <Link
                    href="/gis-map"
                    className="inline-flex items-center gap-1 text-primary font-bold hover:underline mt-2"
                  >
                    <span>Inspect on GIS Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: Section 15 Objection Filing */}
        {activeTab === "OBJECTION" && (
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold font-sans text-on-surface">
                Section 15 Statutory Objection & Tribunal Claim
              </h2>
              <p className="text-xs text-emphasis mt-1">
                Landowners have the statutory right under Section 15(1) to file objections regarding land measurement, valuation rates, or rehabilitation assistance.
              </p>
            </div>

            {objectionSubmitted ? (
              <div className="p-6 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-950 font-sans text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="text-lg font-bold">Section 15 Objection Registered Successfully</h3>
                <p className="text-xs max-w-md mx-auto text-emerald-900 font-mono">
                  Objection Dossier Reference: <strong>OBJ-2026-RAM-42A</strong>. The Competent Authority (CALA) has scheduled an inquiry hearing on 15 September 2026.
                </p>
                <button
                  type="button"
                  onClick={() => setObjectionSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-mono font-bold hover:bg-emerald-800 cursor-pointer"
                >
                  File Additional Clarification
                </button>
              </div>
            ) : (
              <form onSubmit={handleObjectionSubmit} className="space-y-4 max-w-2xl font-sans">
                <div>
                  <label className="block text-xs uppercase font-bold text-emphasis mb-1 font-mono">
                    Objection Category (Statutory Ground)
                  </label>
                  <select
                    value={objectionType}
                    onChange={(e) => setObjectionType(e.target.value)}
                    className="solarized-input w-full p-2.5 rounded-xl text-xs font-mono font-bold"
                  >
                    <option value="COMPENSATION_RATE">Dispute Market Rate / Rural Multiplier (Sec 26)</option>
                    <option value="AREA_MEASUREMENT">Dispute Land Measurement / Boundary Coordinates (Sec 9)</option>
                    <option value="ASSET_VALUATION">Omission of Trees / Farm Structure Valuation (Sec 29)</option>
                    <option value="RR_SCHEME">Rehabilitation & Resettlement Entitlement (Sec 31)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-emphasis mb-1 font-mono">
                    Detailed Grounds for Hearing & Claim
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={objectionNotes}
                    onChange={(e) => setObjectionNotes(e.target.value)}
                    placeholder="Provide specific details regarding the parcel measurement, sale deed references, or unvalued attached assets..."
                    className="solarized-input w-full p-3 rounded-xl text-xs font-mono font-bold"
                  ></textarea>
                </div>

                <div className="p-3 bg-surface-container-high/60 rounded-xl border border-outline-variant/30 text-xs font-mono text-emphasis">
                  Note: All Section 15 filings are permanently recorded on the tamper-evident audit ledger and forwarded to the District Collectorate hearing desk.
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Statutory Objection to CALA Desk</span>
                </button>
              </form>
            )}
          </section>
        )}

        {/* Tab 5: Signed e-Receipt & QR */}
        {activeTab === "RECEIPT" && (
          <section className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/40 shadow-xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold font-sans text-on-surface">
                  Official Statutory e-Receipt & Award Certificate
                </h2>
                <p className="text-xs text-emphasis mt-1">
                  Cryptographically verifiable citizen acknowledgment under Government of India Land Acquisition Rules.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-xs font-mono text-primary font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>

            {/* Certificate Card */}
            <div className="max-w-2xl mx-auto p-6 md:p-8 bg-background/90 border-2 border-primary/30 rounded-2xl font-mono text-xs space-y-4 shadow-inner">
              <div className="text-center pb-4 border-b border-outline-variant/30">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                  GOI
                </div>
                <h3 className="text-base font-bold text-primary font-sans">
                  DEPARTMENT OF LAND RESOURCES • GOVT OF INDIA
                </h3>
                <p className="text-[10px] text-emphasis">
                  RFCTLARR Act 2013 • Statutory Award Disbursement Certificate
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-emphasis block text-[10px]">Beneficiary Name:</span>
                  <span className="font-bold text-on-surface">{name}</span>
                </div>
                <div>
                  <span className="text-emphasis block text-[10px]">Aadhaar Reference:</span>
                  <span className="font-bold text-on-surface">•••• •••• {aadhaarLast4}</span>
                </div>
                <div>
                  <span className="text-emphasis block text-[10px]">Khasra Parcel:</span>
                  <span className="font-bold text-on-surface">{khasraNo} ({village})</span>
                </div>
                <div>
                  <span className="text-emphasis block text-[10px]">PFMS UTR Reference:</span>
                  <span className="font-bold text-primary">PFMS1679001234</span>
                </div>
                <div>
                  <span className="text-emphasis block text-[10px]">Award Sanctioned:</span>
                  <span className="font-bold text-emerald-800 text-sm">₹ 2,23,44,000</span>
                </div>
                <div>
                  <span className="text-emphasis block text-[10px]">Disbursement Status:</span>
                  <span className="font-bold text-success-green">CREDITED TO SBI A/C</span>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] text-emphasis">Digitally Certified by:</div>
                  <div className="font-bold text-primary">Dr. Rajeshwar Sharma, IAS</div>
                  <div className="text-[10px] text-emphasis">Competent Authority (CALA Dausa)</div>
                </div>
                <div className="w-16 h-16 bg-surface-container-high border border-outline-variant/40 rounded-lg flex items-center justify-center p-1">
                  <QrCode className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
