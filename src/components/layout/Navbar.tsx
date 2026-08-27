"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  ShieldCheck,
  Building2,
  Menu,
  X,
  UserCheck,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  userType: "OFFICER" | "CITIZEN";
  department?: string;
  khasraNo?: string;
  aadhaarLast4?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const isCitizen = user?.userType === "CITIZEN" || user?.role === "CITIZEN";

  const officerNavLinks = [
    { href: "/executive-dashboard", label: "Executive Overview" },
    { href: "/operations", label: "Operations Queue" },
    { href: "/workflow", label: "Workflow Tracker" },
    { href: "/gis-map", label: "GIS Cadastral Map" },
    { href: "/compensation", label: "Compensation & R&R" },
    { href: "/acquisitions/new", label: "New Project" },
  ];

  const citizenNavLinks = [
    { href: "/citizen-portal", label: "My Land Records & Awards" },
    { href: "/workflow", label: "Workflow Tracker" },
    { href: "/gis-map", label: "GIS Cadastral Map" },
    { href: "/compensation", label: "Compensation Calculator" },
    { href: "/thank-you", label: "Statutory e-Receipt" },
  ];

  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/login", label: "Citizen Login" },
    { href: "/login?redirect=/executive-dashboard", label: "Officer Portal" },
  ];

  const navLinks = user
    ? isCitizen
      ? citizenNavLinks
      : officerNavLinks
    : publicNavLinks;

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#fdf6e3]/85 backdrop-blur-xl border-b border-outline-variant/40 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Seal */}
        <div className="flex items-center shrink-0">
          <Link href={user ? (isCitizen ? "/citizen-portal" : "/executive-dashboard") : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-serif font-bold text-lg shadow-sm border border-primary-container group-hover:scale-105 transition-transform">
              NL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-2xl tracking-tight text-primary group-hover:text-primary-container transition-colors">
                  NLAMS
                </span>
                <span className="text-[10px] font-mono uppercase bg-surface-container-high px-2 py-0.5 rounded text-emphasis font-bold border border-outline-variant/40">
                  GOI Portal
                </span>
              </div>
              <p className="text-[11px] font-sans font-medium text-emphasis hidden sm:block tracking-tight">
                National Land Acquisition & Management System
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center justify-center gap-1.5 flex-1 mx-4">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-sans font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-sm"
                    : "text-emphasis hover:text-primary hover:bg-surface-container-high/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-lg text-emphasis hover:text-primary hover:bg-surface-container-high/70 transition-colors relative"
              title="Statutory Alerts"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger"></span>
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                  <h4 className="text-xs font-mono font-bold uppercase text-emphasis">
                    Statutory Alerts (3)
                  </h4>
                  <span className="text-[10px] text-danger font-mono font-semibold">
                    1 SLA Breach
                  </span>
                </div>
                <div className="space-y-2 mt-3 text-xs">
                  <div className="p-2 rounded bg-danger/10 border border-danger/20">
                    <p className="font-semibold text-danger">Solar Park 400MW</p>
                    <p className="text-[11px] text-on-surface-variant">
                      Section 11 Inquiry overdue by 4 days (Satna Collectorate).
                    </p>
                  </div>
                  <div className="p-2 rounded bg-warning/10 border border-warning/20">
                    <p className="font-semibold text-warning-amber">
                      Dholera Zone B
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Section 19 Declaration pending sanction (6 days remaining).
                    </p>
                  </div>
                  <div className="p-2 rounded bg-surface-container/60 border border-outline-variant/30">
                    <p className="font-semibold text-primary">
                      PFMS DBT Batch Dispatched
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      ₹12.8 Cr successfully credited for Dausa package beneficiaries.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Sign In / Active Session Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={isCitizen ? "/citizen-portal" : "/executive-dashboard"}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors shadow-sm ${
                  isCitizen
                    ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/40 text-emerald-900"
                    : "bg-surface-container-high/80 hover:bg-surface-container-highest border-outline-variant/40"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-semibold text-xs shadow-sm ${
                    isCitizen ? "bg-emerald-700" : "bg-primary"
                  }`}
                >
                  {isCitizen ? (
                    <UserCheck className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-tight font-sans text-on-surface">
                    {user.name.split(" ")[0]} {user.name.split(" ")[1] || ""}
                  </div>
                  <div className="text-[10px] font-sans text-emphasis">
                    {isCitizen
                      ? `Citizen (•••• ${user.aadhaarLast4 || "4291"})`
                      : user.role.replace("_", " ")}
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-emphasis hover:text-danger hover:bg-danger/10 border border-outline-variant/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-semibold font-sans">
                Sign In / Login
              </span>
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-emphasis hover:text-primary lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4 pt-2 border-t border-outline-variant/30 glass-card">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider ${
                  pathname === item.href
                    ? "bg-primary text-white font-semibold"
                    : "text-emphasis hover:bg-surface-container-high"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-danger hover:bg-danger/10 text-left flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
