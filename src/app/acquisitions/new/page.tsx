"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  FileText,
  CircleDollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
} from "lucide-react";

export default function NewAcquisitionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "Varanasi-Ranchi-Kolkata Greenfield Corridor (Pkg 2)",
    sponsoringAgency: "National Highways Authority of India (NHAI)",
    state: "Uttar Pradesh",
    districts: "Chandauli, Sonbhadra",
    totalAreaHa: "320.5",
    affectedVillagesCount: "18",
    affectedFamiliesCount: "640",
    sanctionedBudgetCr: "850.0",
    purpose: "HIGHWAY",
    siaAgency: "State Social Impact Assessment Directorate",
    publicHearingDate: "2025-01-15",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/acquisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          districts: formData.districts.split(",").map((d) => d.trim()),
        }),
      });

      setTimeout(() => {
        setSubmitting(false);
        router.push("/thank-you");
      }, 1000);
    } catch (err) {
      setSubmitting(false);
      router.push("/thank-you");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-surface-container-high px-2 py-0.5 rounded text-primary border border-outline-variant/30">
                Statutory Intake
              </span>
              <span className="text-xs font-mono text-emphasis">
                Form 1 Requisition (RFCTLARR Act 2013)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 font-sans">
              New Land Acquisition Requisition
            </h1>
          </div>

          {/* Stepper Progress Bar */}
          <div className="glass-card rounded-2xl p-4 mb-8 border border-outline-variant/40">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono font-bold">
              <div
                className={`p-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  step >= 1 ? "bg-primary text-white" : "bg-surface-container text-emphasis"
                }`}
              >
                <span>1. Project Details</span>
              </div>
              <div
                className={`p-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  step >= 2 ? "bg-primary text-white" : "bg-surface-container text-emphasis"
                }`}
              >
                <span>2. Spatial Extent</span>
              </div>
              <div
                className={`p-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  step >= 3 ? "bg-primary text-white" : "bg-surface-container text-emphasis"
                }`}
              >
                <span>3. SIA Mandate</span>
              </div>
              <div
                className={`p-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  step >= 4 ? "bg-primary text-white" : "bg-surface-container text-emphasis"
                }`}
              >
                <span>4. DSC Sign-off</span>
              </div>
            </div>
          </div>

          {/* Form Wizard Body */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-outline-variant/40 max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary font-mono uppercase pb-2 border-b border-outline-variant/20">
                    Step 1: Project Requisition & Sponsoring Agency
                  </h3>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                      Sponsoring Authority
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sponsoringAgency}
                      onChange={(e) => setFormData({ ...formData, sponsoringAgency: e.target.value })}
                      className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                        Districts (comma separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.districts}
                        onChange={(e) => setFormData({ ...formData, districts: e.target.value })}
                        className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary font-mono uppercase pb-2 border-b border-outline-variant/20">
                    Step 2: Spatial Extent & Affected Population
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                        Total Area (Ha)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.totalAreaHa}
                        onChange={(e) => setFormData({ ...formData, totalAreaHa: e.target.value })}
                        className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                        Revenue Villages
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.affectedVillagesCount}
                        onChange={(e) => setFormData({ ...formData, affectedVillagesCount: e.target.value })}
                        className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                        Displaced Families
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.affectedFamiliesCount}
                        onChange={(e) => setFormData({ ...formData, affectedFamiliesCount: e.target.value })}
                        className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Khasra GeoJSON Upload */}
                  <div className="p-4 bg-surface-container-high/60 rounded-xl border border-dashed border-primary/50 text-center space-y-2">
                    <Upload className="w-6 h-6 text-primary mx-auto" />
                    <p className="text-xs font-mono text-on-surface font-semibold">
                      Upload Revenue Cadastral Boundaries (Shapefile / GeoJSON / CSV)
                    </p>
                    <p className="text-[11px] font-mono text-emphasis">
                      Auto-extracts Khasra polygons and right-of-way alignment.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary font-mono uppercase pb-2 border-b border-outline-variant/20">
                    Step 3: Social Impact Assessment (SIA) Mandate
                  </h3>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                      Designated SIA Agency / Institution
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.siaAgency}
                      onChange={(e) => setFormData({ ...formData, siaAgency: e.target.value })}
                      className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                        Public Hearing Date (Sec 5)
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.publicHearingDate}
                        onChange={(e) => setFormData({ ...formData, publicHearingDate: e.target.value })}
                        className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-emphasis mb-1 font-semibold">
                        Sanctioned Budget (₹ Cr)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={formData.sanctionedBudgetCr}
                        onChange={(e) => setFormData({ ...formData, sanctionedBudgetCr: e.target.value })}
                        className="solarized-input w-full p-2.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary font-mono uppercase pb-2 border-b border-outline-variant/20">
                    Step 4: Statutory Requisition Summary & DSC e-Sign
                  </h3>
                  <div className="p-4 bg-surface-container-high/70 rounded-xl space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-emphasis">Project:</span>
                      <span className="font-bold text-on-surface">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emphasis">Agency:</span>
                      <span className="font-bold text-on-surface">{formData.sponsoringAgency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emphasis">Extent:</span>
                      <span className="font-bold text-on-surface">{formData.totalAreaHa} Ha ({formData.affectedVillagesCount} Villages)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emphasis">Sanction:</span>
                      <span className="font-bold text-primary">₹{formData.sanctionedBudgetCr} Cr</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
                    <div className="text-xs font-mono">
                      <div className="font-bold text-primary">Cryptographic Token e-Sign Ready</div>
                      <div className="text-emphasis text-[11px]">
                        CALA Certificate will be affixed to Form 1 Gazette requisition.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t border-outline-variant/30">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="glass-card px-4 py-2 rounded-lg text-xs font-mono font-bold text-emphasis flex items-center gap-1 hover:bg-surface-container"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1 hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    {submitting ? "Signing & Submitting..." : "e-Sign & Submit Requisition"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
