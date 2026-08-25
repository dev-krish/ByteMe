"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  CheckCircle2,
  FileCheck2,
  Printer,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
} from "lucide-react";

export default function ThankYouPage() {
  const caseId = "ACQ-2024-8842-A";
  const timestamp = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 my-auto flex flex-col items-center">
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-outline-variant/40 shadow-xl w-full text-center">
          {/* Green Check Icon */}
          <div className="w-20 h-20 rounded-full bg-secondary-container/60 border border-secondary/40 text-secondary flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-on-surface font-sans">
            Application Submitted Successfully
          </h1>
          <p className="text-xs text-emphasis max-w-md mx-auto mt-2 leading-relaxed">
            Your statutory land acquisition requisition has been cryptographically signed and registered with the State Revenue Directorate.
          </p>

          {/* Official Acknowledgment Receipt Card */}
          <div className="my-6 p-5 rounded-xl bg-background/80 border border-outline-variant/40 text-left font-mono text-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="text-[10px] text-emphasis uppercase font-bold block">
                  Case Reference ID
                </span>
                <span className="text-lg font-bold text-primary tracking-wider">
                  {caseId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emphasis uppercase font-bold block">
                  Registration Time
                </span>
                <span className="text-xs text-on-surface">
                  {timestamp}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-emphasis">Requisition Stage:</span>
                <span className="font-bold text-on-surface ml-1">Section 4 (SIA)</span>
              </div>
              <div>
                <span className="text-emphasis">Sponsoring Agency:</span>
                <span className="font-bold text-on-surface ml-1">NHAI</span>
              </div>
              <div>
                <span className="text-emphasis">Gazette Sync Status:</span>
                <span className="font-bold text-success-green ml-1">Queued for e-Gazette</span>
              </div>
              <div>
                <span className="text-emphasis">Digital Signature:</span>
                <span className="font-bold text-primary ml-1">Verified (Class 3 DSC)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/workflow"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-xs font-mono uppercase tracking-wider px-6 py-3 rounded-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Track in Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto glass-card hover:bg-surface-container text-emphasis text-xs font-mono uppercase tracking-wider px-6 py-3 rounded-lg font-bold border border-outline-variant/40 transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-primary" />
              <span>Print Acknowledgment</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
