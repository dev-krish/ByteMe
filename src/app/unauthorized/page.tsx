"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  ShieldAlert,
  Lock,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Home,
  LogOut,
  AlertCircle,
  KeyRound,
  FileCheck2,
} from "lucide-react";

interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  userType: "OFFICER" | "CITIZEN";
  khasraNo?: string;
  aadhaarLast4?: string;
  village?: string;
}

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptedPath = searchParams.get("attemptedPath") || "/executive-dashboard";
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const handleLogoutAndSwitch = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(`/login?redirect=${encodeURIComponent(attemptedPath)}`);
    } catch {
      router.push("/login");
    }
  };

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 my-auto flex flex-col items-center justify-center text-center">
      <div className="glass-card rounded-3xl p-8 md:p-12 border border-danger/30 shadow-2xl w-full relative overflow-hidden">
        {/* Ambient Red Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-danger/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Security Shield Icon */}
        <div className="w-20 h-20 rounded-3xl bg-danger/10 border border-danger/30 text-danger flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/15 border border-danger/30 text-danger text-xs font-mono font-bold uppercase mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>Statutory Officer Clearance Required • 403 Forbidden</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-on-surface font-sans mb-3">
          Access Restricted to Statutory Revenue Officers
        </h1>

        <p className="text-xs md:text-sm text-emphasis max-w-lg mx-auto leading-relaxed mb-6">
          You are currently logged in with a verified <strong className="text-on-surface">Citizen / Landowner</strong> credential. The operational module you attempted to access is restricted under RFCTLARR-2013 statutory rules.
        </p>

        {/* Current Active Citizen Session Box */}
        <div className="p-4 rounded-2xl bg-surface-container/70 border border-outline-variant/40 text-left text-xs font-mono mb-6 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
            <span className="text-emphasis font-bold uppercase text-[10px]">
              Active Session Details
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 font-bold text-[10px]">
              Role: CITIZEN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-emphasis">Authenticated Name:</span>
              <span className="font-bold text-on-surface ml-1.5">
                {user?.name || "Rameshwar Prasad Meena"}
              </span>
            </div>
            <div>
              <span className="text-emphasis">Aadhaar Linked:</span>
              <span className="font-bold text-emerald-700 ml-1.5">
                •••• {user?.aadhaarLast4 || "4291"}
              </span>
            </div>
            <div>
              <span className="text-emphasis">Requested Module:</span>
              <span className="font-bold text-danger ml-1.5">{attemptedPath}</span>
            </div>
            <div>
              <span className="text-emphasis">Required Authority:</span>
              <span className="font-bold text-primary ml-1.5">CALA / DG NHAI / DoLR</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/citizen-portal"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Return to Citizen Portal</span>
          </Link>

          <button
            onClick={handleLogoutAndSwitch}
            className="w-full sm:w-auto bg-surface-container-high hover:bg-surface-container-highest border border-primary/40 text-primary font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In as Revenue Officer</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-sans">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-emphasis">
            Verifying security clearance level...
          </div>
        }
      >
        <UnauthorizedContent />
      </Suspense>
      <Footer />
    </div>
  );
}
