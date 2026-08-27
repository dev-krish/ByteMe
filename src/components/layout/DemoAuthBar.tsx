"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  UserCheck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Building,
  User,
  Landmark,
  Layers,
  MapPin,
  CircleDollarSign,
  CheckCircle,
  Zap,
} from "lucide-react";

interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  userType: "OFFICER" | "CITIZEN";
  department?: string;
  district?: string;
  khasraNo?: string;
}

export const DEMO_OPTIONS = [
  {
    id: "citizen-rameshwar",
    category: "CITIZEN",
    name: "Rameshwar Prasad Meena",
    roleLabel: "Landowner (Dausa)",
    detail: "Plot 42A • ₹223.44 L Awarded",
    badgeColor: "bg-emerald-600 text-white",
    path: "/citizen-portal",
  },
  {
    id: "citizen-sunita",
    category: "CITIZEN",
    name: "Smt. Sunita Devi",
    roleLabel: "Landowner (Bandikui)",
    detail: "Khasra 108/2 • ₹34.80 L Dispatched",
    badgeColor: "bg-emerald-600 text-white",
    path: "/citizen-portal",
  },
  {
    id: "citizen-vikram",
    category: "CITIZEN",
    name: "Vikram Rathore",
    roleLabel: "Landowner (Sawai Madhopur)",
    detail: "Khasra 89/1 • ₹78.20 L Queued",
    badgeColor: "bg-emerald-600 text-white",
    path: "/citizen-portal",
  },
  {
    id: "officer-cala",
    category: "OFFICER",
    name: "Rajeshwar Sharma, IAS",
    roleLabel: "Competent Authority (CALA Dausa)",
    detail: "Collectorate Land Acquisition Desk",
    badgeColor: "bg-primary text-white",
    path: "/executive-dashboard",
  },
  {
    id: "officer-dg",
    category: "OFFICER",
    name: "Dr. Vikramaditya Sen",
    roleLabel: "Director General (NHAI HQ)",
    detail: "National Highways Command Apex",
    badgeColor: "bg-purple-700 text-white",
    path: "/executive-dashboard",
  },
  {
    id: "officer-dolr",
    category: "OFFICER",
    name: "Ananya Deshmukh, IAS",
    roleLabel: "DoLR Lead / Administrator",
    detail: "Dept of Land Resources (DoLR)",
    badgeColor: "bg-blue-700 text-white",
    path: "/executive-dashboard",
  },
  {
    id: "officer-finance",
    category: "OFFICER",
    name: "Suresh Kumar",
    roleLabel: "Chief Finance Officer",
    detail: "PFMS Compensation & DBT Cell",
    badgeColor: "bg-amber-700 text-white",
    path: "/compensation",
  },
  {
    id: "officer-surveyor",
    category: "OFFICER",
    name: "Priya Sundaram",
    roleLabel: "Chief Cadastral Surveyor",
    detail: "Survey of India (GIS Division)",
    badgeColor: "bg-teal-700 text-white",
    path: "/gis-map",
  },
];

export default function DemoAuthBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [switching, setSwitching] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Check active session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleDemoSwitch = async (presetId: string, targetPath?: string) => {
    setSwitching(presetId);
    setDropdownOpen(false);

    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        const destination = targetPath || data.redirectUrl || "/executive-dashboard";
        router.push(destination);
        router.refresh();
      }
    } catch (err) {
      console.error("Demo login failed:", err);
    } finally {
      setSwitching(null);
    }
  };

  const isCitizen = currentUser?.userType === "CITIZEN" || currentUser?.role === "CITIZEN";

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 text-white py-1.5 px-3 md:px-6 shadow-md z-50 border-b border-white/10 font-sans text-xs">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Badge & Current Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-[11px] font-mono font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>DEMO AUTH MODE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-200 text-[11px]">
            <span>Active Session:</span>
            {currentUser ? (
              <span className="font-semibold text-white flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                {isCitizen ? (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span>{currentUser.name}</span>
                <span className="opacity-75 font-mono text-[10px]">
                  ({isCitizen ? "Citizen" : currentUser.role.replace("_", " ")})
                </span>
              </span>
            ) : (
              <span className="text-amber-200/80 font-mono italic">Guest / Unauthenticated</span>
            )}
          </div>
        </div>

        {/* Right Quick Switch Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Citizen Demo Button */}
          <button
            type="button"
            disabled={switching !== null}
            onClick={() => handleDemoSwitch("citizen-rameshwar", "/citizen-portal")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer ${
              isCitizen && currentUser?.name.includes("Rameshwar")
                ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300"
                : "bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/40"
            }`}
            title="1-Click Login as Citizen Rameshwar Meena"
          >
            {switching === "citizen-rameshwar" ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <User className="w-3.5 h-3.5 text-emerald-300" />
            )}
            <span>Citizen Demo (Rameshwar)</span>
          </button>

          {/* Quick Officer Demo Button */}
          <button
            type="button"
            disabled={switching !== null}
            onClick={() => handleDemoSwitch("officer-cala", "/executive-dashboard")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer ${
              !isCitizen && currentUser?.role === "CALA_OFFICER"
                ? "bg-primary text-white shadow-sm ring-1 ring-sky-300"
                : "bg-sky-950/70 hover:bg-sky-800 text-sky-200 border border-sky-600/40"
            }`}
            title="1-Click Login as CALA Officer Rajeshwar Sharma, IAS"
          >
            {switching === "officer-cala" ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            )}
            <span>CALA Officer Demo</span>
          </button>

          {/* Quick NHAI DG Demo Button */}
          <button
            type="button"
            disabled={switching !== null}
            onClick={() => handleDemoSwitch("officer-dg", "/executive-dashboard")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer ${
              currentUser?.role === "DIRECTOR_GENERAL"
                ? "bg-purple-600 text-white shadow-sm ring-1 ring-purple-300"
                : "bg-purple-950/70 hover:bg-purple-800 text-purple-200 border border-purple-600/40"
            }`}
            title="1-Click Login as Director General NHAI"
          >
            {switching === "officer-dg" ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Landmark className="w-3.5 h-3.5 text-purple-300" />
            )}
            <span className="hidden md:inline">NHAI DG Demo</span>
            <span className="md:hidden">DG</span>
          </button>

          {/* Dropdown Menu for All Demo Personas */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-1 text-[11px] font-semibold border border-white/20 cursor-pointer"
            >
              <span>All Personas</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1 font-sans text-xs">
                <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold text-slate-400 border-b border-slate-800">
                  Select Demo Identity (1-Click Switch)
                </div>

                <div className="py-1">
                  <div className="px-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Citizen / Landowner Personas
                  </div>
                  {DEMO_OPTIONS.filter((opt) => opt.category === "CITIZEN").map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={switching !== null}
                      onClick={() => handleDemoSwitch(opt.id, opt.path)}
                      className="w-full text-left p-2 rounded-lg hover:bg-emerald-950/60 transition-colors flex items-start justify-between gap-2 border border-transparent hover:border-emerald-800/50 cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-[12px] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{opt.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-300 font-mono mt-0.5">{opt.roleLabel}</div>
                        <div className="text-[10px] text-emerald-300/80 font-mono">{opt.detail}</div>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-900 text-emerald-200 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        Switch
                      </span>
                    </button>
                  ))}
                </div>

                <div className="py-1 border-t border-slate-800">
                  <div className="px-2 text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                    Officer / Executive Personas
                  </div>
                  {DEMO_OPTIONS.filter((opt) => opt.category === "OFFICER").map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={switching !== null}
                      onClick={() => handleDemoSwitch(opt.id, opt.path)}
                      className="w-full text-left p-2 rounded-lg hover:bg-sky-950/60 transition-colors flex items-start justify-between gap-2 border border-transparent hover:border-sky-800/50 cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-[12px] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span>{opt.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-300 font-mono mt-0.5">{opt.roleLabel}</div>
                        <div className="text-[10px] text-sky-300/80 font-mono">{opt.detail}</div>
                      </div>
                      <span className="text-[10px] font-mono bg-sky-900 text-sky-200 px-1.5 py-0.5 rounded font-semibold shrink-0">
                        Switch
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
