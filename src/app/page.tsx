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
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResult(
      `Found Case ${searchQuery.toUpperCase()}: Delhi-Mumbai Expressway Corridor (Sec 23 Award stage, 85% completed)`
    );
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
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(#006098 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/80 border border-outline-variant/40 text-xs font-mono text-primary font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>RFCTLARR Act 2013 Statutory Framework</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-on-background leading-[1.15]">
              Digitalizing India&apos;s <br />
              <span className="text-primary underline decoration-secondary-container decoration-4 underline-offset-8">
                Land Governance
              </span>
            </h1>

            <p className="text-base md:text-lg text-emphasis max-w-2xl leading-relaxed">
              A single-window, tamper-evident lifecycle management system ensuring stage-gated compliance, high-precision GIS cadastral spatial mapping, and transparent direct-benefit compensation for major infrastructure projects.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/executive-dashboard"
                className="bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-sm transition-all flex items-center gap-2 font-semibold"
              >
                <span>Executive Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gis-map"
                className="glass-card hover:bg-surface-container text-primary font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all flex items-center gap-2 font-semibold border border-outline-variant/40"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span>Explore Cadastral GIS</span>
              </Link>
              <Link
                href="/compensation"
                className="glass-card hover:bg-surface-container text-emphasis font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all flex items-center gap-2 font-semibold border border-outline-variant/40"
              >
                <Calculator className="w-4 h-4 text-primary" />
                <span>RFCTLARR Calculator</span>
              </Link>
            </div>

            {/* Quick Case Search */}
            <div className="pt-4 max-w-xl">
              <form
                onSubmit={handleQuickSearch}
                className="flex items-center gap-2 p-1.5 rounded-xl glass-card border border-outline-variant/50"
              >
                <Search className="w-5 h-5 text-emphasis ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Track Case (e.g. NHAI-DEL-MUM, Plot 42A, Khasra 108/2)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs md:text-sm text-on-surface focus:outline-none flex-1 font-mono"
                />
                <button
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase hover:bg-secondary/90 transition-colors shrink-0"
                >
                  Search
                </button>
              </form>
              {searchResult && (
                <div className="mt-2 p-2.5 rounded-lg bg-surface-container-high/90 border border-primary/30 text-xs font-mono text-primary animate-in fade-in">
                  {searchResult}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Digital Map & Hero Card */}
          <div className="lg:col-span-5 relative">
            <div className="glass-card rounded-2xl p-6 shadow-xl border border-outline-variant/40 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase text-emphasis">
                    Active Revenue Survey
                  </span>
                </div>
                <span className="text-xs font-mono text-primary font-semibold bg-surface-container px-2 py-0.5 rounded">
                  Village: Ramgarh
                </span>
              </div>

              {/* Cadastral Mock Vector graphic */}
              <div className="my-4 h-56 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 p-4 relative flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#006098_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* SVG Cadastral Polygons preview */}
                <svg className="w-full h-full" viewBox="0 0 300 160">
                  <polygon
                    points="30,20 120,30 110,90 20,80"
                    fill="#89f5ea"
                    fillOpacity="0.45"
                    stroke="#006a64"
                    strokeWidth="1.5"
                  />
                  <text x="50" y="55" className="text-[10px] font-mono fill-secondary font-bold">
                    Plot 42A
                  </text>
                  <polygon
                    points="120,30 240,15 260,85 110,90"
                    fill="#007abe"
                    fillOpacity="0.3"
                    stroke="#006098"
                    strokeWidth="1.5"
                  />
                  <text x="160" y="55" className="text-[10px] font-mono fill-primary font-bold">
                    Plot 108/2
                  </text>
                  <polygon
                    points="20,80 110,90 95,145 15,135"
                    fill="#ffdad6"
                    fillOpacity="0.4"
                    stroke="#dc322f"
                    strokeWidth="1.5"
                  />
                  <text x="35" y="118" className="text-[9px] font-mono fill-danger font-bold">
                    Plot 219B (Disputed)
                  </text>
                  <polygon
                    points="110,90 260,85 240,145 95,145"
                    fill="#89f5ea"
                    fillOpacity="0.3"
                    stroke="#006a64"
                    strokeWidth="1.5"
                  />
                  <text x="150" y="120" className="text-[10px] font-mono fill-secondary font-bold">
                    Plot 77/1
                  </text>
                </svg>

                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono bg-background/90 p-2 rounded-lg border border-outline-variant/30">
                  <span className="text-emphasis">Right-of-Way (RoW) Buffer:</span>
                  <span className="text-primary font-bold">60m Corridor Active</span>
                </div>
              </div>

              {/* Stats Footer on Hero Card */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2 rounded-lg bg-surface-container/50">
                  <div className="text-[10px] font-mono uppercase text-emphasis">Parcels</div>
                  <div className="text-base font-mono font-bold text-primary">5,412</div>
                </div>
                <div className="p-2 rounded-lg bg-surface-container/50">
                  <div className="text-[10px] font-mono uppercase text-emphasis">Disbursed</div>
                  <div className="text-base font-mono font-bold text-success-green">94.2%</div>
                </div>
                <div className="p-2 rounded-lg bg-surface-container/50">
                  <div className="text-[10px] font-mono uppercase text-emphasis">e-Signed</div>
                  <div className="text-base font-mono font-bold text-secondary">100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Bento Grid */}
      <section className="py-12 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            National Land Metric Command
          </h2>
          <p className="text-2xl font-bold text-on-background mt-1">
            Real-Time Infrastructure Impact Metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-mono uppercase tracking-wider">Active Projects</span>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-primary">1,248</div>
              <div className="text-xs font-mono text-success-green mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12 projects this month
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-mono uppercase tracking-wider">Area Acquired</span>
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-on-surface">45,210 <span className="text-sm font-normal">Ha</span></div>
              <div className="text-xs font-mono text-emphasis mt-1">
                Across 18 States & UTs
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-mono uppercase tracking-wider">Compensation DBT</span>
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-primary">₹12,400 <span className="text-sm font-normal">Cr</span></div>
              <div className="text-xs font-mono text-success-green mt-1">
                Direct to Aadhaar-linked Bank A/c
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emphasis">
              <span className="text-xs font-mono uppercase tracking-wider">SLA Compliance</span>
              <FileCheck className="w-5 h-5 text-success-green" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-success-green">91.4%</div>
              <div className="text-xs font-mono text-emphasis mt-1">
                Statutory statutory timelines met
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory RFCTLARR Lifecycle Timeline */}
      <section className="py-16 px-4 md:px-8 max-w-[1440px] mx-auto w-full bg-surface-container-low/40 rounded-2xl my-8 border border-outline-variant/30">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1 text-xs font-mono uppercase text-primary font-bold">
            <span>Statutory Lifecycle Architecture</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-background mt-1">
            Stage-Gated Acquisition Process (RFCTLARR-2013)
          </h2>
          <p className="text-sm text-emphasis mt-2">
            Every step is locked with digital audit trails, automated SLA reminders, and statutory gazette integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statutoryStages.map((stage, idx) => (
            <div
              key={stage.step}
              className="glass-card rounded-xl p-5 flex flex-col justify-between relative border border-outline-variant/40 hover:border-primary/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {stage.section}
                  </span>
                  <span className="text-xs font-mono text-emphasis font-bold">
                    STEP {stage.step}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-on-surface mb-2 font-sans">
                  {stage.title}
                </h3>
                <p className="text-xs text-emphasis leading-relaxed">
                  {stage.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] font-mono text-success-green">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Enforced</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase text-primary tracking-widest">
            Core Foundations
          </span>
          <h2 className="text-3xl font-bold text-on-background mt-1">
            Why NLAMS Transforms Land Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <GitPullRequest className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-on-surface font-sans">
                Executable Workflow
              </h3>
              <p className="text-xs text-emphasis leading-relaxed">
                Streamlined, stage-gated processing aligned with statutory mandates under Sections 4, 11, 19, 23, and 38, cutting administrative delays by 65%.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/workflow"
                className="text-xs font-mono font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <span>View Workflow Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-on-surface font-sans">
                GIS Spatial Cadastral Core
              </h3>
              <p className="text-xs text-emphasis leading-relaxed">
                High-precision spatial integration mapping cadastral boundaries, Right-of-Way (RoW) buffers, and land use zoning with instant Khasra lookup.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/gis-map"
                className="text-xs font-mono font-bold text-secondary flex items-center gap-1 hover:underline"
              >
                <span>Open GIS Cadastral Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-on-surface font-sans">
                Transparent DBT & Audit
              </h3>
              <p className="text-xs text-emphasis leading-relaxed">
                Zero-leakage direct benefit transfer through PFMS and e-Kuber, supported by automated statutory solatium calculation and digital signature authentication.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/compensation"
                className="text-xs font-mono font-bold text-emphasis flex items-center gap-1 hover:underline"
              >
                <span>Calculate Compensation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
