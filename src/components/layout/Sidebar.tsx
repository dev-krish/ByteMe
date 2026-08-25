"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitFork,
  MapPin,
  CircleDollarSign,
  UsersRound,
  PlusCircle,
  HelpCircle,
  LogOut,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/executive-dashboard",
      label: "Executive Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/workflow",
      label: "Workflow Tracker",
      icon: GitFork,
    },
    {
      href: "/gis-map",
      label: "GIS Cadastral Map",
      icon: MapPin,
    },
    {
      href: "/compensation",
      label: "Compensation & R&R",
      icon: CircleDollarSign,
    },
  ];

  return (
    <aside className="w-[280px] shrink-0 min-h-[calc(100vh-65px)] bg-glass-surface backdrop-blur-2xl border-r border-outline-variant/30 flex flex-col p-4 shadow-sm hidden md:flex">
      {/* Header Info */}
      <div className="px-3 py-4 mb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
            GOI
          </div>
          <div>
            <h2 className="text-sm font-bold text-primary font-sans">
              NLAMS Core
            </h2>
            <p className="text-[10px] font-mono text-emphasis uppercase tracking-wider">
              Department of Land Resources
            </p>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <Link
        href="/acquisitions/new"
        className="w-full bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-wider py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mb-6"
      >
        <PlusCircle className="w-4 h-4" />
        <span>New Acquisition</span>
      </Link>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emphasis/80 font-bold">
          Operational Modules
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all ${
                isActive
                  ? "bg-secondary-container/90 text-on-secondary-container font-bold shadow-sm border border-secondary/30 scale-[0.98]"
                  : "text-on-surface-variant hover:bg-surface-container-high/70 hover:text-primary"
              }`}
            >
              <Icon className="w-4 h-4 text-primary" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emphasis/80 font-bold">
          Quick Stats
        </div>
        <div className="px-3 py-2 bg-surface-container-low/60 rounded-lg border border-outline-variant/30 text-xs space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-emphasis">Active Projects:</span>
            <span className="font-bold text-primary">1,248</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emphasis">SLA Compliance:</span>
            <span className="font-bold text-success-green">91.4%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emphasis">At Risk:</span>
            <span className="font-bold text-danger">18</span>
          </div>
        </div>
      </nav>

      {/* Footer Links */}
      <div className="pt-4 border-t border-outline-variant/30 space-y-1">
        <Link
          href="/thank-you"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-mono text-emphasis hover:text-primary hover:bg-surface-container-high/50 transition-colors"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Case Receipts & Acks</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-mono text-emphasis hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Officer Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
