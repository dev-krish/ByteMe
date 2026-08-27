"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  FileQuestion,
  Home,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Search,
  UserCheck,
  Compass,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 my-auto flex flex-col items-center justify-center text-center">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-outline-variant/40 shadow-2xl w-full relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

          {/* 404 Icon & Badge */}
          <div className="w-20 h-20 rounded-3xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center mx-auto mb-6 shadow-inner text-primary">
            <FileQuestion className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-mono font-bold uppercase mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Statutory Record Not Found • Error 404</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-on-surface font-sans mb-3">
            Cadastral Record or Page Not Found
          </h1>

          <p className="text-xs md:text-sm text-emphasis max-w-md mx-auto leading-relaxed mb-8">
            The requisition dossier, cadastral parcel index, or statutory URL you requested does not exist on the NLAMS national server or has been relocated under updated gazette notifications.
          </p>

          {/* Useful Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left font-mono text-xs">
            <Link
              href="/"
              className="p-3.5 rounded-2xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-primary" />
                <span className="font-semibold text-on-surface">NLAMS Portal Home</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emphasis group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/gis-map"
              className="p-3.5 rounded-2xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold text-on-surface">GIS Cadastral Map</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emphasis group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/citizen-portal"
              className="p-3.5 rounded-2xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-on-surface">Citizen Landowner Desk</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emphasis group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/workflow"
              className="p-3.5 rounded-2xl bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-primary" />
                <span className="font-semibold text-on-surface">Workflow Tracker</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emphasis group-hover:text-primary transition-colors" />
            </Link>
          </div>

          {/* Primary Action Button */}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-sans font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to National Portal</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
