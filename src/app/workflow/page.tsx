"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { MOCK_PROJECTS } from "@/lib/data/mock-projects";
import { AcquisitionProject, Milestone } from "@/types";
import {
  GitFork,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Building,
  UserCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function WorkflowPage() {
  const [projects, setProjects] = useState<AcquisitionProject[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleAdvanceStage = () => {
    setActionSuccessMessage("Statutory Milestone approved with Digital Signature e-Sign!");
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase bg-surface-container-high px-2 py-0.5 rounded text-primary border border-outline-variant/30">
                  Operational Workflow Engine
                </span>
                <span className="text-xs font-mono text-emphasis">
                  RFCTLARR-2013 Statutory Tracker
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-sans">
                Stage-Gated Acquisition Dossier
              </h1>
            </div>

            {/* Project Switcher */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-emphasis">Select Case:</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="solarized-input text-xs font-mono px-3 py-2 rounded-lg font-bold text-primary"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.code} - {proj.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Success Toast */}
          {actionSuccessMessage && (
            <div className="mb-6 p-3 rounded-xl bg-success-green/15 border border-success-green/30 text-success-green text-xs font-mono flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* Project Dossier Header Card */}
          <div className="glass-card rounded-2xl p-6 border border-outline-variant/40 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono text-primary">
                    {selectedProject.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      selectedProject.status === "ON_TRACK"
                        ? "bg-success-green/15 text-success-green border border-success-green/30"
                        : "bg-danger/15 text-danger border border-danger/30"
                    }`}
                  >
                    {selectedProject.status.replace(/_/g, " ")}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-on-surface font-sans">
                  {selectedProject.title}
                </h2>
                <p className="text-xs text-emphasis">
                  {selectedProject.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-on-surface-variant">
                  <span><strong>Agency:</strong> {selectedProject.sponsoringAgency}</span>
                  <span>•</span>
                  <span><strong>CALA Lead:</strong> {selectedProject.officerName}</span>
                  <span>•</span>
                  <span><strong>Location:</strong> {selectedProject.state} ({selectedProject.districts.join(", ")})</span>
                </div>
              </div>

              {/* Progress & Quick Metrics */}
              <div className="lg:col-span-4 bg-surface-container-high/60 rounded-xl p-4 border border-outline-variant/30 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-emphasis">Overall Progress:</span>
                  <span className="font-bold text-primary">{selectedProject.stageProgress}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${selectedProject.stageProgress}%` }}
                  />
                </div>
                <div className="flex justify-between pt-1 text-[11px]">
                  <span className="text-emphasis">Total Area:</span>
                  <span className="font-bold text-on-surface">{selectedProject.totalAreaHa} Ha</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-emphasis">Compensation Disbursed:</span>
                  <span className="font-bold text-primary">₹{selectedProject.disbursedCompensationCr} Cr</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-emphasis">Remaining SLA:</span>
                  <span className={`font-bold ${selectedProject.slaDaysRemaining > 0 ? "text-success-green" : "text-danger"}`}>
                    {selectedProject.slaDaysRemaining} Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Milestone Stepper */}
          <div className="glass-card rounded-2xl p-6 border border-outline-variant/40 mb-8">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/20">
              <h3 className="text-sm font-bold text-on-surface font-sans">
                Statutory Milestone Execution (Sections 4 to 38)
              </h3>
              <button
                onClick={handleAdvanceStage}
                className="bg-primary hover:bg-primary/90 text-white text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-lg font-semibold shadow-sm flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>e-Sign Next Stage Approval</span>
              </button>
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
              {selectedProject.milestones && selectedProject.milestones.length > 0 ? (
                selectedProject.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border transition-all ${
                      m.status === "COMPLETED"
                        ? "bg-surface-container-high/40 border-outline-variant/40"
                        : m.status === "IN_PROGRESS"
                        ? "bg-secondary-container/30 border-secondary/40 shadow-sm"
                        : "bg-surface-container-low/30 border-outline-variant/20 opacity-70"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                            m.status === "COMPLETED"
                              ? "bg-success-green text-white"
                              : m.status === "IN_PROGRESS"
                              ? "bg-primary text-white animate-pulse"
                              : "bg-surface-container-high text-emphasis"
                          }`}
                        >
                          {m.status === "COMPLETED" ? "✓" : idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary">
                              {m.section}
                            </span>
                            <span className="text-xs font-mono text-emphasis">
                              ({m.actReference})
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                m.status === "COMPLETED"
                                  ? "bg-success-green/15 text-success-green"
                                  : m.status === "IN_PROGRESS"
                                  ? "bg-primary/15 text-primary"
                                  : "bg-surface-container-high text-emphasis"
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-on-surface mt-0.5">
                            {m.name}
                          </h4>
                          <p className="text-xs text-emphasis font-mono">
                            Officer In-Charge: {m.officerInCharge}
                          </p>
                        </div>
                      </div>

                      {/* Documents / Gazette details */}
                      <div className="flex flex-col md:items-end gap-1 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-emphasis" />
                          <span className="text-emphasis">
                            Target Date: {m.targetDate}
                          </span>
                        </div>
                        {m.documents && m.documents.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {m.documents.map((doc, docIdx) => (
                              <span
                                key={docIdx}
                                className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-[11px] text-primary border border-outline-variant/30"
                              >
                                <FileText className="w-3 h-3" />
                                {doc.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs font-mono text-emphasis">
                  Milestones initialized under standard RFCTLARR-2013 pipeline.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
