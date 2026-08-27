"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  Globe,
  FileText,
  CheckCircle2,
  Building2,
  Cpu,
  Layers,
  Award,
  PhoneCall,
  Mail,
  Lock,
  Sparkles,
  Server,
  Zap,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#eee8d5]/90 border-t border-[#657b83]/30 mt-auto text-[#586e75] font-sans relative overflow-hidden backdrop-blur-md">
      {/* Top Tricolor Accent Line */}
      <div className="w-full h-1 bg-gradient-to-r from-[#ff9933] via-[#ffffff] to-[#138808]" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-10 pb-6">
        {/* Top Government & System Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-[#657b83]/20">
          {/* Brand & Mandate */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006098] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
                GOI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-[#071e25] font-sans tracking-tight">
                    NLAMS
                  </span>
                  <span className="text-xs font-sans font-semibold bg-[#006098]/15 text-[#006098] px-2.5 py-0.5 rounded-full border border-[#006098]/30">
                    SIH 2026 • Team ByteMe
                  </span>
                </div>
                <p className="text-xs font-sans text-[#586e75] mt-0.5">
                  National Land Acquisition & Management System
                </p>
              </div>
            </div>

            <p className="text-xs text-[#586e75] leading-relaxed max-w-md font-sans">
              A single-window, tamper-evident statutory platform digitizing the complete RFCTLARR-2013 lifecycle — from Project Requisition & SIA to Cadastral GIS RoW Overlays, PFMS DBT Disbursements, and Encumbrance-Free Possession.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 font-sans">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>RFCTLARR-2013 Statutory Compliance</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>DILRMP OGC Spatial Certified</span>
              </span>
            </div>
          </div>

          {/* Quick Modules */}
          <div className="lg:col-span-2 space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071e25] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#006098]" />
              <span>Core Modules</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#586e75]">
              <li>
                <Link href="/workflow" className="hover:text-[#006098] transition-colors flex items-center gap-1">
                  <span>Sec 4-38 Workflow</span>
                </Link>
              </li>
              <li>
                <Link href="/gis-map" className="hover:text-[#006098] transition-colors flex items-center gap-1">
                  <span>Cadastral GIS RoW Core</span>
                </Link>
              </li>
              <li>
                <Link href="/compensation" className="hover:text-[#006098] transition-colors flex items-center gap-1">
                  <span>Valuation &amp; PFMS DBT</span>
                </Link>
              </li>
              <li>
                <Link href="/executive-dashboard" className="hover:text-[#006098] transition-colors flex items-center gap-1">
                  <span>Apex Command Matrix</span>
                </Link>
              </li>
              <li>
                <Link href="/acquisitions/new" className="hover:text-[#006098] transition-colors flex items-center gap-1">
                  <span>Form 1 Case Intake</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Statutory Acts & Schedules */}
          <div className="lg:col-span-3 space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071e25] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#006098]" />
              <span>Statutory Laws</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#586e75]">
              <li className="hover:text-[#071e25] transition-colors">
                • RFCTLARR Act, 2013 (Act 30 of 2013)
              </li>
              <li className="hover:text-[#071e25] transition-colors">
                • First Schedule (Sec 26-30 Valuation &amp; Solatium)
              </li>
              <li className="hover:text-[#071e25] transition-colors">
                • Second &amp; Third Schedule (R&amp;R Entitlements)
              </li>
              <li className="hover:text-[#071e25] transition-colors">
                • Section 64 (Land Tribunal Escrow Referral)
              </li>
              <li className="hover:text-[#071e25] transition-colors">
                • Section 10A (Infrastructure Fast-track)
              </li>
            </ul>
          </div>

          {/* National Helpdesk & System Support */}
          <div className="lg:col-span-2 space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071e25] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#006098]" />
              <span>Apex Helpdesk</span>
            </h4>
            <div className="space-y-2 text-xs text-[#586e75]">
              <div className="p-3 rounded-xl bg-[#fdf6e3] border border-[#657b83]/20 space-y-1">
                <p className="font-semibold text-[#071e25]">Toll-Free Helpline:</p>
                <p className="text-[#006098] font-bold text-sm font-sans tracking-wide">1800-11-NLAMS</p>
                <p className="text-[11px] text-[#586e75]">(65267 • 24x7 Support)</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Mail className="w-3.5 h-3.5 text-[#006098]" />
                <span className="truncate">helpdesk-nlams@gov.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Federated Gateway Status Bar */}
        <div className="py-4 my-2 border-b border-[#657b83]/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-[#071e25] font-bold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#006098]" />
              <span>Federated Gateway Status:</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PFMS e-Kuber (Live)</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DILRMP Bhulekh API (Live)</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PostGIS Spatial Cluster (0.04s)</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Class 3 DSC PKI Bridge</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#586e75]">
            <span className="bg-[#fdf6e3] px-2.5 py-0.5 rounded border border-[#657b83]/20 font-bold">
              Latency: 14ms
            </span>
            <span className="bg-[#fdf6e3] px-2.5 py-0.5 rounded border border-[#657b83]/20 font-bold">
              Build: v2.5.0-SIH2026
            </span>
          </div>
        </div>

        {/* Bottom Rights & Team Credits */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#586e75] gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <p>
              © {currentYear} National Land Acquisition & Management System (NLAMS). Department of Land Resources (DoLR), Ministry of Rural Development, Govt. of India.
            </p>
            <p className="text-[10px] text-[#586e75]">
              Designed & Engineered for <strong>Smart India Hackathon 2026</strong> by <strong>Team ByteMe</strong> (Ayush, Divyanshu, Karan, Krishnendu, Mahek, Priyansi).
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link href="#" className="hover:text-[#006098] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-[#006098] transition-colors">Terms of Use</Link>
            <span>•</span>
            <Link href="#" className="hover:text-[#006098] transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>CERT-In Audit Passed</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
