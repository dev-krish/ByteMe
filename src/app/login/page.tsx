"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import {
  ShieldCheck,
  KeyRound,
  User,
  Usb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Building,
  Lock,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/executive-dashboard";
  const authReason = searchParams.get("reason");

  const [email, setEmail] = useState("cala.dausa@gov.in");
  const [password, setPassword] = useState("cala@2026");
  const [roleLabel, setRoleLabel] = useState("CALA Officer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dscScanning, setDscScanning] = useState(false);
  const [dscSuccess, setDscSuccess] = useState(false);

  const setPresetOfficer = (presetEmail: string, presetPass: string, label: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setRoleLabel(label);
    setErrorMsg(null);
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Authentication failed. Invalid credentials.");
        setLoading(false);
        return;
      }

      // Successful authentication with HttpOnly cookie set by server
      router.push(redirectTarget);
    } catch {
      setErrorMsg("Network error contacting NIC Parichay Auth Server.");
      setLoading(false);
    }
  };

  const handleDscAuth = async () => {
    setDscScanning(true);
    setDscSuccess(false);
    setErrorMsg(null);

    try {
      // Simulate hardware USB token handshake with server login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "cala.dausa@gov.in", password: "cala@2026" }),
      });

      if (res.ok) {
        setDscScanning(false);
        setDscSuccess(true);
        setTimeout(() => {
          router.push(redirectTarget);
        }, 800);
      } else {
        setDscScanning(false);
        setErrorMsg("DSC Certificate signature verification failed.");
      }
    } catch {
      setDscScanning(false);
      setErrorMsg("Hardware cryptographic token communication failure.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between p-4 md:p-8 font-sans">
      {/* Top minimal header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg font-serif">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-sans font-bold">
            NL
          </div>
          <span>NLAMS</span>
        </Link>
        <span className="text-xs font-sans font-semibold bg-surface-container-high px-2.5 py-0.5 rounded-full text-emphasis border border-outline-variant/30">
          Gov of India • National Portal
        </span>
      </div>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        {/* Seal and Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center shadow-inner text-primary">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface font-sans">
            Officer Authentication Portal
          </h1>
          <p className="text-xs text-emphasis mt-1">
            Department of Land Resources (DoLR) • RFCTLARR-2013 Command
          </p>
        </div>

        {/* Middleware Access Alert Banner */}
        {authReason === "auth_required" && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Security Notice: Officer authentication is required to access statutory operational modules.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-danger/15 border border-danger/30 text-danger text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Officer Switcher Preset Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-surface-container-high/70 rounded-xl mb-4 text-xs font-semibold border border-outline-variant/30">
          <button
            type="button"
            onClick={() => setPresetOfficer("cala.dausa@gov.in", "cala@2026", "CALA Officer")}
            className={`py-2 rounded-lg transition-all text-center ${
              email === "cala.dausa@gov.in"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:text-on-surface"
            }`}
          >
            CALA Officer
          </button>
          <button
            type="button"
            onClick={() => setPresetOfficer("dg.nhai@gov.in", "nhai@2026", "Director General")}
            className={`py-2 rounded-lg transition-all text-center ${
              email === "dg.nhai@gov.in"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:text-on-surface"
            }`}
          >
            NHAI DG
          </button>
          <button
            type="button"
            onClick={() => setPresetOfficer("officer@nic.in", "demo@2026", "DoLR Lead")}
            className={`py-2 rounded-lg transition-all text-center ${
              email === "officer@nic.in"
                ? "bg-primary text-white shadow-sm"
                : "text-emphasis hover:text-on-surface"
            }`}
          >
            DoLR Lead
          </button>
        </div>

        {/* Glassmorphic Login Box */}
        <div className="glass-card rounded-2xl p-6 md:p-8 shadow-xl border border-outline-variant/40">
          <form onSubmit={handleStandardLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs uppercase text-emphasis mb-1 font-bold">
                Official Email / Parichay ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-emphasis absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="solarized-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold"
                  placeholder="name@gov.in"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase text-emphasis font-bold">
                  Password
                </label>
                <span className="text-[11px] text-emphasis">
                  Demo Pass: <code className="text-primary font-bold">{password}</code>
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-emphasis absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="solarized-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-mono font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Verifying HMAC-SHA256 Token...</span>
              ) : (
                <>
                  <span>Sign In as {roleLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-outline-variant/40 w-full" />
            <span className="bg-[#eee8d5] px-3 text-[10px] uppercase font-bold text-emphasis absolute rounded-full">
              Or Cryptographic Hardware
            </span>
          </div>

          {/* DSC USB Token Flow */}
          <div>
            <button
              type="button"
              onClick={handleDscAuth}
              disabled={dscScanning}
              className="w-full bg-surface-container-high hover:bg-surface-container-highest border border-primary/40 text-primary font-sans text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Usb className="w-4 h-4" />
              <span>
                {dscScanning
                  ? "Verifying PKCS#11 Hardware Token..."
                  : dscSuccess
                  ? "DSC Token Verified & Signed!"
                  : "Authenticate via Class 3 DSC Token"}
              </span>
            </button>

            {dscSuccess && (
              <div className="mt-2 p-2 bg-success-green/10 border border-success-green/30 rounded-lg text-xs font-sans text-success-green flex items-center gap-1.5 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>CCA India Class 3 Certificate Authenticated (2048-bit RSA)</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto text-center text-xs text-emphasis space-x-3">
        <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
          <BadgeCheck className="w-3.5 h-3.5" />
          <span>Server-Side HttpOnly Session Guard Active</span>
        </span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading portal security...</div>}>
      <LoginForm />
    </Suspense>
  );
}
