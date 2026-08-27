"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  GitPullRequest,
  Calculator,
  Layers,
  FileCheck,
  Building2,
  TrendingUp,
  Search,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Activity,
  Compass,
  FileText,
  BadgeCheck,
  X,
  Wallet,
  Users,
} from "lucide-react";
import { useState } from "react";

interface SearchCase {
  id: string;
  title: string;
  location: string;
  stage: string;
  stageCode: string;
  progress: number;
  area: string;
  dbtAmount: string;
  beneficiaries: number;
  slaStatus: string;
}

const PRESET_CASES: Record<string, SearchCase> = {
  "NHAI-DEL-MUM-PKG4": {
    id: "NHAI-DEL-MUM-PKG4",
    title: "Delhi-Mumbai 8-Lane Expressway (Package 4)",
    location: "Ramgarh & Bandikui Tehsils, Dausa District, Rajasthan",
    stage: "Award & Solatium Determination",
    stageCode: "Section 23 & 30",
    progress: 85,
    area: "142.5 Ha (5,412 Khasras)",
    dbtAmount: "₹48.20 Cr / ₹54.00 Cr",
    beneficiaries: 412,
    slaStatus: "On Schedule (Day 184 / 365)",
  },
  "Khasra 108/2 (Dausa)": {
    id: "DAUSA-RAM-108/2",
    title: "RoW Corridor Parcel 108/2 (Ramgarh Revenue Circle)",
    location: "Village Ramgarh, Tehsil Dausa, Rajasthan",
    stage: "Direct Benefit Transfer (DBT) Possession",
    stageCode: "Section 38",
    progress: 92,
    area: "0.85 Ha (Agricultural Multi-crop)",
    dbtAmount: "₹34.80 Lakh Disbursed",
    beneficiaries: 3,
    slaStatus: "Clearance Granted",
  },
  "RAIL-DFCC-W-PKG2": {
    id: "RAIL-DFCC-W-PKG2",
    title: "Western Dedicated Freight Corridor (Phase 2)",
    location: "Rewari-Palanpur Section, Gujarat-Haryana Alignment",
    stage: "Objection Inquiry & Hearing",
    stageCode: "Section 15 & 19",
    progress: 60,
    area: "310.0 Ha (Rail Corridor)",
    dbtAmount: "₹112.50 Cr Allocated",
    beneficiaries: 1240,
    slaStatus: "Public Hearing Active",
  },
};

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchCase | null>(null);

  const handleQuickSearch = (queryText?: string) => {
    const q = queryText || searchQuery;
    if (!q.trim()) return;
    setSearchQuery(q);
    
    if (PRESET_CASES[q]) {
      setSearchResult(PRESET_CASES[q]);
    } else {
      setSearchResult({
        id: q.toUpperCase().replace(/\s+/g, "-"),
        title: `Corridor Acquisition Project (${q})`,
        location: "State Cadastral Alignment • DILRMP Portal",
        stage: "Section 23 Award Determination",
        stageCode: "Section 23",
        progress: 78,
        area: "115.4 Ha (Notified)",
        dbtAmount: "₹36.40 Cr Disbursed",
        beneficiaries: 284,
        slaStatus: "Statutory SLA Compliant",
      });
    }
  };

  const statutoryStages = [
    {
      step: "01",
      section: "Section 4",
      title: "Social Impact Assessment (SIA)",
      desc: "Mandatory public consultations, impact evaluations, and multi-crop land assessments.",
    },
    {
      step: "02",
      section: "Section 11",
      title: "Preliminary Notification",
      desc: "Publication in official gazette & vernacular papers, freezing land alienation.",
    },
    {
      step: "03",
      section: "Section 15 & 19",
      title: "Objection Hearing & Declaration",
      desc: "Inquiry into claims and formal declaration of acquisition with R&R summary.",
    },
    {
      step: "04",
      section: "Section 23 & 30",
      title: "Award & Solatium",
      desc: "Determination of market value, 100% statutory solatium, and 12% additional interest.",
    },
    {
      step: "05",
      section: "Section 38",
      title: "DBT Disbursement & Possession",
      desc: "Direct benefit transfer via PFMS and lawful transfer of encumbrance-free title.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-sans relative overflow-hidden">
      <Navbar />

      {/* Full-Canvas Scaled Subtle Watermark Cadastral & Topographic Map */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* 1. Ambient Warm & Cyan Light Meshes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-[#89f5ea]/25 via-[#007abe]/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 left-4 w-[500px] h-[500px] bg-[#006098]/8 rounded-full blur-3xl" />
        <div className="absolute top-20 right-4 w-[500px] h-[500px] bg-[#859900]/8 rounded-full blur-3xl" />

        {/* 2. Extra Large, Low-Visibility Cadastral & RoW Corridor Map Watermark */}
        <svg
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[140vw] max-w-[2200px] h-[920px] opacity-[0.14]"
          viewBox="0 0 2000 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sprawling Land Parcel Mosaic Grid */}
          <g stroke="#006098" strokeWidth="1" opacity="0.45">
            {/* Left Sector Parcels */}
            <polygon points="40,90 280,50 340,240 100,280" fill="#006098" fillOpacity="0.04" />
            <polygon points="280,50 540,110 500,290 340,240" fill="#89f5ea" fillOpacity="0.06" />
            <polygon points="540,110 740,70 710,270 500,290" fill="#006a64" fillOpacity="0.04" />
            <polygon points="100,280 340,240 300,460 80,430" fill="#859900" fillOpacity="0.05" />
            <polygon points="340,240 500,290 460,490 300,460" fill="#006098" fillOpacity="0.06" />
            <polygon points="500,290 710,270 670,480 460,490" fill="#89f5ea" fillOpacity="0.04" />
            <polygon points="80,430 300,460 260,650 40,610" fill="#006a64" fillOpacity="0.05" />
            <polygon points="300,460 460,490 420,680 260,650" fill="#006098" fillOpacity="0.04" />
            <polygon points="460,490 670,480 640,700 420,680" fill="#859900" fillOpacity="0.06" />

            {/* Right Sector Parcels */}
            <polygon points="1300,80 1520,40 1580,220 1340,260" fill="#006098" fillOpacity="0.05" />
            <polygon points="1520,40 1760,100 1720,280 1580,220" fill="#89f5ea" fillOpacity="0.04" />
            <polygon points="1760,100 1960,60 1930,250 1720,280" fill="#006a64" fillOpacity="0.06" />
            <polygon points="1340,260 1580,220 1540,440 1310,420" fill="#859900" fillOpacity="0.04" />
            <polygon points="1580,220 1720,280 1670,470 1540,440" fill="#006098" fillOpacity="0.05" />
            <polygon points="1720,280 1930,250 1890,460 1670,470" fill="#89f5ea" fillOpacity="0.06" />
            <polygon points="1310,420 1540,440 1500,640 1280,600" fill="#006098" fillOpacity="0.04" />
            <polygon points="1540,440 1670,470 1630,670 1500,640" fill="#006a64" fillOpacity="0.05" />
            <polygon points="1670,470 1890,460 1860,680 1630,670" fill="#859900" fillOpacity="0.04" />
          </g>

          {/* Broad RoW Highway Corridor Center Alignment */}
          <path
            d="M-50,500 C450,420 850,560 1250,380 C1650,200 1850,300 2050,220"
            stroke="#006098"
            strokeWidth="48"
            strokeOpacity="0.06"
            strokeLinecap="round"
          />
          <path
            d="M-50,500 C450,420 850,560 1250,380 C1650,200 1850,300 2050,220"
            stroke="#006098"
            strokeWidth="1.5"
            strokeDasharray="10 8"
            opacity="0.4"
          />
          <path
            d="M-50,524 C450,444 850,584 1250,404 C1650,224 1850,324 2050,244"
            stroke="#006a64"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M-50,476 C450,396 850,536 1250,356 C1650,176 1850,276 2050,196"
            stroke="#006a64"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Soft Flowing Topographic Elevation Contours */}
          <path
            d="M-50,160 C420,50 780,340 1180,180 C1580,20 1820,260 2050,130"
            stroke="#006098"
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.35"
          />
          <path
            d="M-50,260 C440,140 800,420 1200,260 C1600,100 1840,360 2050,230"
            stroke="#006a64"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M-50,370 C400,260 760,520 1160,380 C1560,240 1800,480 2050,350"
            stroke="#859900"
            strokeWidth="1"
            strokeDasharray="10 5"
            opacity="0.25"
          />
          <path
            d="M-50,640 C420,540 780,740 1200,600 C1620,460 1850,690 2050,580"
            stroke="#006098"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M-50,740 C460,650 820,840 1240,700 C1660,560 1890,800 2050,680"
            stroke="#006a64"
            strokeWidth="1"
            strokeDasharray="5 5"
            opacity="0.25"
          />

          {/* Faint Surveyor Annotations */}
          <g fontSize="11" fontFamily="monospace" fill="#006098" opacity="0.28" fontWeight="bold">
            <text x="180" y="180">KHASRA 42/1</text>
            <text x="400" y="180">PLOT 88-A</text>
            <text x="200" y="360">KHASRA 108/2 (RoW)</text>
            <text x="1440" y="160">KHASRA 219/B</text>
            <text x="1660" y="160">SEC 11(1) NOTIFIED</text>
            <text x="1440" y="340">AWARD SEC 23</text>
            <text x="1700" y="360">KHASRA 312/A</text>
            <text x="880" y="600">ALIGNMENT: 60M RoW (NHAI)</text>
            <text x="1550" y="550">ELEVATION: +160m MSL</text>
            <text x="320" y="560">ELEVATION: +140m MSL</text>
          </g>

          {/* Subtle Coordinate Crosshairs */}
          <g stroke="#006098" strokeWidth="1" opacity="0.25">
            <path d="M 280,120 L 280,140 M 270,130 L 290,130" />
            <path d="M 680,250 L 680,270 M 670,260 L 690,260" />
            <path d="M 1520,240 L 1520,260 M 1510,250 L 1530,250" />
            <path d="M 1780,450 L 1780,470 M 1770,460 L 1790,460" />
            <path d="M 400,620 L 400,640 M 390,630 L 410,630" />
          </g>
        </svg>

        {/* 3. Subtle Small Dot-Matrix Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle, #006098 1.1px, transparent 1.1px)`,
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 80% 65% at 50% 35%, black 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 65% at 50% 35%, black 70%, transparent 100%)",
          }}
        />
      </div>

      {/* Hero Section — Clean, Focused & Centered */}
      <section className="relative z-10 pt-20 pb-14 px-4 md:px-8 max-w-[1440px] mx-auto w-full text-center flex flex-col items-center">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          {/* Main Headline with Classy Gradient Serif */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-background leading-[1.12]">
            Digitalizing India&apos;s <br />
            <span
              className="font-serif italic font-normal bg-gradient-to-r from-[#006098] via-[#007abe] to-[#006a64] bg-clip-text text-transparent block mt-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-sm"
              style={{ fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif" }}
            >
              Land Governance
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-emphasis max-w-2xl mx-auto leading-relaxed font-sans">
            A single-window, tamper-evident statutory platform digitizing the complete acquisition lifecycle — ensuring stage-gated RFCTLARR compliance, 60m RoW GIS cadastral overlays, and instantaneous PFMS direct benefit compensation.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login?redirect=/executive-dashboard"
              className="bg-primary hover:bg-primary/90 text-white font-sans font-semibold text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5"
            >
              <span>Executive Command Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/gis-map"
              className="glass-card hover:bg-surface-container text-primary font-sans font-semibold text-sm px-8 py-3.5 rounded-xl transition-all flex items-center gap-2.5 border border-primary/30 shadow-sm"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span>Explore Cadastral GIS Engine</span>
            </Link>
          </div>

          {/* Clean Integrated Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuickSearch();
              }}
              className="flex items-center gap-2 p-2 rounded-2xl glass-card border border-outline-variant/60 shadow-md backdrop-blur-md"
            >
              <Search className="w-5 h-5 text-emphasis ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Track Case Reference or Khasra No (e.g. NHAI-DEL-MUM, 108/2, Plot 42A)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs sm:text-sm text-on-surface focus:outline-none flex-1 font-mono px-2 placeholder:text-emphasis/60"
              />
              <button
                type="submit"
                className="bg-secondary text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase hover:bg-secondary/90 transition-colors shrink-0 shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Quick Preset Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] font-mono text-emphasis">
              <span className="font-bold text-primary">Quick Lookups:</span>
              <button
                type="button"
                onClick={() => handleQuickSearch("NHAI-DEL-MUM-PKG4")}
                className="px-2.5 py-1 rounded-lg bg-surface-container/70 hover:bg-surface-container-high border border-outline-variant/40 transition-colors"
              >
                NHAI-DEL-MUM-PKG4
              </button>
              <button
                type="button"
                onClick={() => handleQuickSearch("Khasra 108/2 (Dausa)")}
                className="px-2.5 py-1 rounded-lg bg-surface-container/70 hover:bg-surface-container-high border border-outline-variant/40 transition-colors"
              >
                Khasra 108/2 (Dausa)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSearch("RAIL-DFCC-W-PKG2")}
                className="px-2.5 py-1 rounded-lg bg-surface-container/70 hover:bg-surface-container-high border border-outline-variant/40 transition-colors"
              >
                DFCC Western Corridor
              </button>
            </div>

            {searchResult && (
              <div className="mt-4 p-5 rounded-2xl glass-card border border-primary/30 shadow-xl text-left animate-in fade-in slide-in-from-top-2 bg-[#eee8d5]/90 backdrop-blur-md">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold text-primary tracking-wider uppercase">
                      Verified Statutory Dossier
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                      {searchResult.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchResult(null)}
                    className="p-1 rounded-md text-emphasis hover:text-danger hover:bg-danger/10 transition-colors"
                    title="Dismiss Result"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Title & Location */}
                <div className="pt-3">
                  <h4 className="text-base font-bold text-on-surface font-sans">
                    {searchResult.title}
                  </h4>
                  <p className="text-xs text-emphasis font-sans mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{searchResult.location}</span>
                  </p>
                </div>

                {/* Metric Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3.5">
                  <div className="p-2.5 rounded-xl bg-surface-container/70 border border-outline-variant/30 font-mono">
                    <div className="text-[10px] uppercase text-emphasis font-bold">Stage</div>
                    <div className="text-xs font-bold text-primary mt-0.5 truncate" title={searchResult.stage}>
                      {searchResult.stageCode}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container/70 border border-outline-variant/30 font-mono">
                    <div className="text-[10px] uppercase text-emphasis font-bold">Acquired Area</div>
                    <div className="text-xs font-bold text-on-surface mt-0.5 truncate">
                      {searchResult.area}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container/70 border border-outline-variant/30 font-mono">
                    <div className="text-[10px] uppercase text-emphasis font-bold">PFMS DBT</div>
                    <div className="text-xs font-bold text-success-green mt-0.5 truncate">
                      {searchResult.dbtAmount}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container/70 border border-outline-variant/30 font-mono">
                    <div className="text-[10px] uppercase text-emphasis font-bold">Beneficiaries</div>
                    <div className="text-xs font-bold text-secondary mt-0.5">
                      {searchResult.beneficiaries} Landowners
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Actions */}
                <div className="pt-2 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-emphasis mb-1">
                      <span>Statutory Acquisition Progress</span>
                      <span className="font-bold text-primary">{searchResult.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                        style={{ width: `${searchResult.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/gis-map"
                      className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-mono font-bold flex items-center gap-1.5 border border-outline-variant/40 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>GIS Map</span>
                    </Link>
                    <Link
                      href="/workflow"
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <span>Open Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cadastral GIS & RoW Corridor Showcase */}
      <section className="relative z-10 py-8 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="glass-card rounded-2xl p-6 md:p-8 shadow-xl border border-outline-variant/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/30 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
                  Live Cadastral Spatial Inspection
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface font-sans mt-0.5">
                Right-of-Way (RoW) 60m Corridor Overlay
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-primary font-semibold bg-surface-container px-3 py-1 rounded-full border border-outline-variant/40">
                Village: Ramgarh (Dausa Circle)
              </span>
              <Link
                href="/gis-map"
                className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Full GIS Engine</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
            {/* SVG Cadastral Polygons preview */}
            <div className="lg:col-span-8 h-64 md:h-72 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 p-4 relative flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#006098_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <svg className="w-full h-full" viewBox="0 0 320 160">
                {/* Plot 42A (Top-Left) */}
                <polygon
                  points="25,18 135,28 125,82 18,72"
                  fill="#89f5ea"
                  fillOpacity="0.45"
                  stroke="#006a64"
                  strokeWidth="1.8"
                />
                <text
                  x="76"
                  y="52"
                  textAnchor="middle"
                  className="text-[11px] font-mono fill-[#006a64] font-bold"
                >
                  Plot 42A
                </text>

                {/* Plot 108/2 RoW (Top-Right) */}
                <polygon
                  points="135,28 298,16 288,82 125,82"
                  fill="#007abe"
                  fillOpacity="0.32"
                  stroke="#006098"
                  strokeWidth="2"
                />
                <text
                  x="212"
                  y="52"
                  textAnchor="middle"
                  className="text-[11px] font-mono fill-[#006098] font-bold"
                >
                  Plot 108/2 (RoW)
                </text>

                {/* Plot 219B Disputed (Bottom-Left) */}
                <polygon
                  points="18,72 125,82 110,145 8,135"
                  fill="#ffdad6"
                  fillOpacity="0.55"
                  stroke="#dc322f"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
                <text
                  x="65"
                  y="105"
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-[#dc322f] font-bold"
                >
                  Plot 219B
                </text>
                <text
                  x="65"
                  y="120"
                  textAnchor="middle"
                  className="text-[8.5px] font-mono fill-[#dc322f] font-bold opacity-80"
                >
                  (Sec 64 Hold)
                </text>

                {/* Plot 77/1 (Bottom-Right) */}
                <polygon
                  points="125,82 288,82 272,145 110,145"
                  fill="#89f5ea"
                  fillOpacity="0.4"
                  stroke="#006a64"
                  strokeWidth="1.8"
                />
                <text
                  x="196"
                  y="115"
                  textAnchor="middle"
                  className="text-[11px] font-mono fill-[#006a64] font-bold"
                >
                  Plot 77/1
                </text>
              </svg>

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono bg-background/90 p-2.5 rounded-lg border border-outline-variant/30">
                <span className="text-emphasis">Statutory Buffer:</span>
                <span className="text-primary font-bold">60m High-Speed RoW Alignment Active</span>
              </div>
            </div>

            {/* Quick Metrics Aside */}
            <div className="lg:col-span-4 space-y-3 font-sans">
              <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30">
                <div className="text-xs text-emphasis font-semibold">Total Corridor Parcels</div>
                <div className="text-2xl font-bold text-primary mt-1 tracking-tight">5,412 Khasras</div>
                <div className="text-xs text-emphasis mt-1">Dausa, Lalsot, Bandikui Tehsils</div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30">
                <div className="text-xs text-emphasis font-semibold">DBT Direct Transfer</div>
                <div className="text-2xl font-bold text-success-green mt-1 tracking-tight">94.2% Disbursed</div>
                <div className="text-xs text-emphasis mt-1">PFMS e-Kuber Aadhaar Route</div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30">
                <div className="text-xs text-emphasis font-semibold">Digital Signatures</div>
                <div className="text-2xl font-bold text-secondary mt-1 tracking-tight">100% e-Signed</div>
                <div className="text-xs text-emphasis mt-1">Class 3 Hardware DSC Token</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory RFCTLARR Framework & Calculator Card Section */}
      <section className="relative z-10 py-10 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/40 text-xs font-mono text-primary font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>RFCTLARR Act 2013 Statutory Framework</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-background font-sans">
              Stage-Gated Statutory Acquisition Pipeline
            </h2>
            <p className="text-xs text-emphasis mt-1 font-mono">
              Enforcing rigid legislative compliance from Preliminary Survey to Physical Possession.
            </p>
          </div>

          <Link
            href="/compensation"
            className="glass-card hover:bg-surface-container text-primary font-sans text-xs font-semibold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 border border-outline-variant/40 shrink-0 self-start md:self-auto"
          >
            <Calculator className="w-4 h-4 text-primary" />
            <span>Launch RFCTLARR Calculator</span>
          </Link>
        </div>

        {/* 5 Statutory Steps Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statutoryStages.map((stage) => (
            <div
              key={stage.step}
              className="glass-card glass-card-hover rounded-xl p-5 border border-outline-variant/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-primary">
                    {stage.step}
                  </span>
                  <span className="text-[10px] font-sans font-semibold bg-surface-container px-2 py-0.5 rounded text-emphasis">
                    {stage.section}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-2 font-sans">
                  {stage.title}
                </h3>
                <p className="text-xs text-emphasis leading-relaxed font-sans">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Impact Bento Grid */}
      <section className="relative z-10 py-10 px-4 md:px-8 max-w-[1440px] mx-auto w-full mb-8">
        <div className="mb-8">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-primary">
            National Land Metric Command
          </h2>
          <p className="text-2xl font-bold text-on-background mt-1 font-sans">
            Real-Time Infrastructure Impact Metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-sans font-semibold">Active Projects</span>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-sans text-primary tracking-tight">1,248</div>
              <div className="text-xs font-sans text-success-green mt-1 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +12 projects this month
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-sans font-semibold">Area Acquired</span>
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-sans text-on-surface tracking-tight">
                45,210 <span className="text-sm font-normal text-emphasis">Ha</span>
              </div>
              <div className="text-xs font-sans text-emphasis mt-1">
                Across 18 States &amp; UTs
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-sans font-semibold">Compensation DBT</span>
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-sans text-primary tracking-tight">
                ₹12,400 <span className="text-sm font-normal text-emphasis">Cr</span>
              </div>
              <div className="text-xs font-sans text-success-green mt-1 font-semibold">
                Direct to Aadhaar-linked Bank A/c
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-sans font-semibold">SLA Compliance</span>
              <FileCheck className="w-5 h-5 text-success-green" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-sans text-success-green tracking-tight">98.4%</div>
              <div className="text-xs font-sans text-emphasis mt-1">
                Within statutory 12-mo timeline
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
