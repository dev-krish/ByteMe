"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  User,
  Usb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Building,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"LAO" | "ADMIN" | "SURVEYOR" | "CITIZEN">("LAO");
  const [username, setUsername] = useState("rajeshwar.cala@nic.in");
  const [password, setPassword] = useState("••••••••");
  const [dscScanning, setDscScanning] = useState(false);
  const [dscSuccess, setDscSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/executive-dashboard");
    }, 600);
  };

  const handleDscAuth = () => {
    setDscScanning(true);
    setDscSuccess(false);
    setTimeout(() => {
      setDscScanning(false);
      setDscSuccess(true);
      setTimeout(() => {
        router.push("/executive-dashboard");
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between p-4 md:p-8">
      {/* Top minimal header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
            NL
          </div>
          <span>NLAMS</span>
        </Link>
        <span className="text-[11px] font-mono uppercase bg-surface-container-high px-2 py-0.5 rounded text-emphasis">
          Gov of India
        </span>
      </div>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        {/* Seal and Title */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-surface-container-high border border-outline-variant/60 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Secure Authority Portal</h1>
          <p className="text-xs text-emphasis mt-1">
            National Land Acquisition & Management System (RFCTLARR-2013)
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-surface-container-high/70 rounded-xl mb-4 text-[11px] font-mono border border-outline-variant/30">
          <button
            type="button"
            onClick={() => {
              setRole("LAO");
              setUsername("rajeshwar.cala@nic.in");
            }}
            className={`py-1.5 rounded-lg transition-all ${
              role === "LAO"
                ? "bg-primary text-white font-bold shadow-sm"
                : "text-emphasis hover:text-on-surface"
            }`}
          >
            CALA / LAO
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("ADMIN");
              setUsername("superadmin.nlams@gov.in");
            }}
            className={`py-1.5 rounded-lg transition-all ${
              role === "ADMIN"
                ? "bg-primary text-white font-bold shadow-sm"
                : "text-emphasis hover:text-on-surface"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("SURVEYOR");
              setUsername("surveyor.dausa@gov.in");
            }}
            className={`py-1.5 rounded-lg transition-all ${
              role === "SURVEYOR"
                ? "bg-primary text-white font-bold shadow-sm"
                : "text-emphasis hover:text-on-surface"
            }`}
          >
            Surveyor
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("CITIZEN");
              setUsername("rameshwar.meena@gmail.com");
            }}
            className={`py-1.5 rounded-lg transition-all ${
              role === "CITIZEN"
                ? "bg-primary text-white font-bold shadow-sm"
                : "text-emphasis hover:text-on-surface"
            }`}
          >
            Citizen
          </button>
        </div>

        {/* Glassmorphic Login Box */}
        <div className="glass-card rounded-2xl p-6 md:p-8 shadow-xl border border-outline-variant/40">
          <form onSubmit={handleStandardLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                Official Email / Parichay ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emphasis absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="solarized-input w-full pl-9 pr-3 py-2.5 rounded-lg text-xs font-mono"
                  placeholder="name@gov.in"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-emphasis font-semibold">
                  Password
                </label>
                <a href="#" className="text-[11px] text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-emphasis absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="solarized-input w-full pl-9 pr-3 py-2.5 rounded-lg text-xs font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-wider py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 font-bold"
            >
              {loading ? (
                <span>Authenticating with NIC Parichay...</span>
              ) : (
                <>
                  <span>Sign In ({role})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-outline-variant/40 w-full" />
            <span className="bg-[#eee8d5] px-3 text-[10px] font-mono uppercase text-emphasis absolute rounded">
              Or Authenticate With
            </span>
          </div>

          {/* DSC USB Token Flow */}
          <div>
            <button
              type="button"
              onClick={handleDscAuth}
              disabled={dscScanning}
              className="w-full bg-surface-container-high hover:bg-surface-container-highest border border-primary/40 text-primary font-mono text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Usb className="w-4 h-4" />
              <span>
                {dscScanning
                  ? "Detecting Crypto Token (e-Pass2003)..."
                  : dscSuccess
                  ? "DSC Verified! Redirecting..."
                  : "Digital Signature Certificate (DSC)"}
              </span>
            </button>

            {dscSuccess && (
              <div className="mt-2 p-2 bg-success-green/10 border border-success-green/30 rounded text-[11px] font-mono text-success-green flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Class 3 Signing Certificate Valid (Exp: 2026)</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto text-center text-xs text-emphasis space-x-3">
        <a href="#" className="hover:text-primary">Helpdesk</a>
        <span>•</span>
        <a href="#" className="hover:text-primary">DSC Drivers</a>
        <span>•</span>
        <a href="#" className="hover:text-primary">NIC Security Compliance</a>
      </footer>
    </div>
  );
}
