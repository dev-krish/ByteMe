"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { MOCK_PARCELS } from "@/lib/data/cadastral-parcels";
import { CadastralParcel } from "@/types";
import {
  Layers,
  Search,
  MapPin,
  ShieldAlert,
  CheckCircle,
  Eye,
  Ruler,
  FileCheck2,
  TreeDeciduous,
  Home,
  X,
  ExternalLink,
} from "lucide-react";

export default function GisMapPage() {
  const [parcels, setParcels] = useState<CadastralParcel[]>(MOCK_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(MOCK_PARCELS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLayers, setActiveLayers] = useState({
    rowBuffer: true,
    cadastralBoundaries: true,
    disputedZones: true,
    forestZones: false,
  });

  const filteredParcels = parcels.filter(
    (p) =>
      p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
        <Sidebar />

        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          {/* Top GIS Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase bg-surface-container-high px-2 py-0.5 rounded text-secondary border border-outline-variant/30">
                  Spatial Cadastral Core
                </span>
                <span className="text-xs font-mono text-emphasis">
                  Dausa Revenue Division (EPSG:4326)
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-on-surface font-sans">
                Interactive Cadastral GIS & RoW Corridor
              </h1>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-emphasis absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Khasra / Owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="solarized-input pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono w-56"
                />
              </div>
            </div>
          </div>

          {/* GIS Map & Inspector Container */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[550px]">
            {/* GIS Map Canvas View */}
            <div className="lg:col-span-8 glass-card rounded-2xl p-4 border border-outline-variant/40 relative flex flex-col overflow-hidden">
              {/* Map Floating Layer Controls */}
              <div className="absolute top-6 left-6 z-20 glass-card p-3 rounded-xl border border-outline-variant/50 text-xs font-mono space-y-2 shadow-lg max-w-xs">
                <div className="flex items-center gap-2 font-bold text-primary pb-1 border-b border-outline-variant/30">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Cadastral Layers</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayers.cadastralBoundaries}
                    onChange={(e) =>
                      setActiveLayers({
                        ...activeLayers,
                        cadastralBoundaries: e.target.checked,
                      })
                    }
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>Revenue Boundaries</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayers.rowBuffer}
                    onChange={(e) =>
                      setActiveLayers({
                        ...activeLayers,
                        rowBuffer: e.target.checked,
                      })
                    }
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>60m RoW Corridor Buffer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayers.disputedZones}
                    onChange={(e) =>
                      setActiveLayers({
                        ...activeLayers,
                        disputedZones: e.target.checked,
                      })
                    }
                    className="rounded text-danger focus:ring-danger"
                  />
                  <span>Disputed Khasras (Sec 64)</span>
                </label>
              </div>

              {/* Map Canvas with Solarized Cadastral Polygons */}
              <div className="flex-1 w-full h-full bg-[#fdf6e3] rounded-xl border border-outline-variant/40 relative overflow-hidden flex items-center justify-center">
                {/* Background grid pattern */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(#586e75 0.5px, transparent 0.5px), linear-gradient(90deg, #586e75 0.5px, transparent 0.5px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* SVG Map Canvas */}
                <svg
                  className="w-full h-full max-h-[500px]"
                  viewBox="0 0 600 400"
                >
                  {/* RoW Buffer Zone */}
                  {activeLayers.rowBuffer && (
                    <path
                      d="M 50,80 Q 280,180 550,220 L 530,300 Q 260,260 30,160 Z"
                      fill="#007abe"
                      fillOpacity="0.08"
                      stroke="#006098"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                  )}

                  {/* Parcel 1: Plot 42A */}
                  {activeLayers.cadastralBoundaries && (
                    <g
                      onClick={() => setSelectedParcel(MOCK_PARCELS[0])}
                      className="cursor-pointer group"
                    >
                      <polygon
                        points="80,90 200,110 180,210 60,190"
                        fill={selectedParcel?.id === "parcel-42a" ? "#89f5ea" : "#daf2fb"}
                        fillOpacity="0.75"
                        stroke="#006098"
                        strokeWidth={selectedParcel?.id === "parcel-42a" ? "3" : "1.5"}
                        className="transition-all hover:fill-secondary-container"
                      />
                      <text x="100" y="150" className="text-xs font-mono font-bold fill-primary">
                        Plot 42A (2.45 Ha)
                      </text>
                    </g>
                  )}

                  {/* Parcel 2: Plot 108/2 */}
                  {activeLayers.cadastralBoundaries && (
                    <g
                      onClick={() => setSelectedParcel(MOCK_PARCELS[1])}
                      className="cursor-pointer group"
                    >
                      <polygon
                        points="200,110 380,90 400,200 180,210"
                        fill={selectedParcel?.id === "parcel-108-2" ? "#89f5ea" : "#e3f7ff"}
                        fillOpacity="0.75"
                        stroke="#006098"
                        strokeWidth={selectedParcel?.id === "parcel-108-2" ? "3" : "1.5"}
                        className="transition-all hover:fill-secondary-container"
                      />
                      <text x="240" y="150" className="text-xs font-mono font-bold fill-primary">
                        Plot 108/2 (3.80 Ha)
                      </text>
                    </g>
                  )}

                  {/* Parcel 3: Plot 219B (Disputed) */}
                  {activeLayers.disputedZones && (
                    <g
                      onClick={() => setSelectedParcel(MOCK_PARCELS[2])}
                      className="cursor-pointer group"
                    >
                      <polygon
                        points="60,190 180,210 160,320 40,300"
                        fill={selectedParcel?.id === "parcel-219b" ? "#ffdad6" : "#ffdad6"}
                        fillOpacity="0.8"
                        stroke="#dc322f"
                        strokeWidth={selectedParcel?.id === "parcel-219b" ? "3" : "2"}
                        strokeDasharray="4 2"
                        className="transition-all hover:fill-error-container"
                      />
                      <text x="70" y="260" className="text-xs font-mono font-bold fill-danger">
                        Plot 219B [Dispute]
                      </text>
                    </g>
                  )}

                  {/* Parcel 4: Plot 77/1 */}
                  {activeLayers.cadastralBoundaries && (
                    <g
                      onClick={() => setSelectedParcel(MOCK_PARCELS[3])}
                      className="cursor-pointer group"
                    >
                      <polygon
                        points="180,210 400,200 370,310 160,320"
                        fill={selectedParcel?.id === "parcel-77-1" ? "#89f5ea" : "#daf2fb"}
                        fillOpacity="0.7"
                        stroke="#006098"
                        strokeWidth={selectedParcel?.id === "parcel-77-1" ? "3" : "1.5"}
                        className="transition-all hover:fill-secondary-container"
                      />
                      <text x="230" y="265" className="text-xs font-mono font-bold fill-primary">
                        Plot 77/1 (1.85 Ha)
                      </text>
                    </g>
                  )}

                  {/* Parcel 5: Plot 14/C */}
                  {activeLayers.cadastralBoundaries && (
                    <g
                      onClick={() => setSelectedParcel(MOCK_PARCELS[4])}
                      className="cursor-pointer group"
                    >
                      <polygon
                        points="400,200 540,190 510,300 370,310"
                        fill={selectedParcel?.id === "parcel-14c" ? "#89f5ea" : "#e3f7ff"}
                        fillOpacity="0.7"
                        stroke="#006098"
                        strokeWidth={selectedParcel?.id === "parcel-14c" ? "3" : "1.5"}
                        className="transition-all hover:fill-secondary-container"
                      />
                      <text x="420" y="255" className="text-xs font-mono font-bold fill-primary">
                        Plot 14/C (2.90 Ha)
                      </text>
                    </g>
                  )}
                </svg>

                {/* Map Bottom HUD */}
                <div className="absolute bottom-4 right-4 glass-card px-3 py-1.5 rounded-lg border border-outline-variant/40 text-[11px] font-mono text-emphasis flex items-center gap-3">
                  <span>Scale 1:2,500</span>
                  <span>•</span>
                  <span>Lat: 26.892° N, Long: 76.331° E</span>
                </div>
              </div>
            </div>

            {/* Cadastral Parcel Inspector Drawer */}
            <div className="lg:col-span-4 glass-card rounded-2xl p-5 border border-outline-variant/40 flex flex-col justify-between overflow-y-auto">
              {selectedParcel ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                        Khasra Dossier
                      </span>
                      <h3 className="text-xl font-bold text-on-surface font-mono mt-1">
                        {selectedParcel.khasraNo}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        selectedParcel.surveyStatus === "VERIFIED"
                          ? "bg-success-green/15 text-success-green"
                          : "bg-danger/15 text-danger"
                      }`}
                    >
                      {selectedParcel.surveyStatus}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Revenue Village:</span>
                      <span className="font-semibold text-on-surface">{selectedParcel.village}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Land Owner:</span>
                      <span className="font-semibold text-primary">{selectedParcel.ownerName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Aadhaar Linked:</span>
                      <span className={selectedParcel.aadhaarLinked ? "text-success-green font-bold" : "text-danger font-bold"}>
                        {selectedParcel.aadhaarLinked ? "Yes (e-KYC Verified)" : "Pending Verification"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Area Extent:</span>
                      <span className="font-bold text-on-surface">{selectedParcel.areaHa} Hectares</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Circle Rate:</span>
                      <span className="font-semibold text-on-surface">₹{(selectedParcel.circleRatePerHa / 100000).toFixed(1)} Lakh / Ha</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Land Use & Soil:</span>
                      <span className="font-semibold text-on-surface">{selectedParcel.landUse} ({selectedParcel.soilClassification})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Structures / Trees:</span>
                      <span className="font-semibold text-on-surface">{selectedParcel.structuresCount} Struct / {selectedParcel.treesCount} Trees</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-outline-variant/15">
                      <span className="text-emphasis">Award Amount:</span>
                      <span className="font-bold text-primary">₹{selectedParcel.awardedAmountLakhs} Lakhs</span>
                    </div>
                  </div>

                  {selectedParcel.disputeNotes && (
                    <div className="p-2.5 rounded-lg bg-danger/10 border border-danger/30 text-danger text-[11px] font-mono">
                      <p className="font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Litigation Flag:</span>
                      </p>
                      <p className="mt-1">{selectedParcel.disputeNotes}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <a
                      href={`/compensation?khasra=${encodeURIComponent(selectedParcel.khasraNo)}`}
                      className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-mono uppercase tracking-wider py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <span>Load In Compensation Engine</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs font-mono text-emphasis">
                  Click on any cadastral parcel polygon to inspect ownership and survey records.
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
