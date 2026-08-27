"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { CadastralParcel } from "@/types";

interface CadastralMapProps {
  parcels: CadastralParcel[];
  selectedParcel: CadastralParcel | null;
  onSelectParcel: (parcel: CadastralParcel) => void;
  activeLayers: {
    rowBuffer: boolean;
    cadastralBoundaries: boolean;
    disputedZones: boolean;
    forestZones: boolean;
  };
}

export default function CadastralMap({
  parcels,
  selectedParcel,
  onSelectParcel,
  activeLayers,
}: CadastralMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{
    parcelsLayer?: L.LayerGroup;
    rowBufferLayer?: L.LayerGroup;
    forestLayer?: L.LayerGroup;
  }>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Dausa, Rajasthan revenue zone
    const map = L.map(mapContainerRef.current, {
      center: [26.894, 76.342],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    // High clarity CartoDB Positron style tile layer suited for Solarized Light Theme
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when activeLayers, parcels, or selectedParcel changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up old layers
    if (layersGroupRef.current.parcelsLayer) {
      map.removeLayer(layersGroupRef.current.parcelsLayer);
    }
    if (layersGroupRef.current.rowBufferLayer) {
      map.removeLayer(layersGroupRef.current.rowBufferLayer);
    }
    if (layersGroupRef.current.forestLayer) {
      map.removeLayer(layersGroupRef.current.forestLayer);
    }

    const parcelsLayer = L.layerGroup();
    const rowBufferLayer = L.layerGroup();
    const forestLayer = L.layerGroup();

    // 1. Right-of-Way (RoW) Corridor 60m Buffer
    if (activeLayers.rowBuffer) {
      // Highway Centerline
      const centerlineCoordinates: [number, number][] = [
        [26.887, 76.326],
        [26.892, 76.333],
        [26.896, 76.341],
        [26.901, 76.349],
        [26.906, 76.357],
      ];

      // Polyline for Centerline
      L.polyline(centerlineCoordinates, {
        color: "#b58900", // Solarized Yellow
        weight: 3,
        dashArray: "6, 6",
      }).addTo(rowBufferLayer);

      // 60m RoW Buffer Corridor Polygon
      const bufferPolygonCoordinates: [number, number][] = [
        [26.889, 76.324],
        [26.894, 76.331],
        [26.898, 76.339],
        [26.903, 76.347],
        [26.908, 76.355],
        [26.904, 76.359],
        [26.899, 76.351],
        [26.894, 76.343],
        [26.890, 76.335],
        [26.885, 76.328],
        [26.889, 76.324],
      ];

      L.polygon(bufferPolygonCoordinates, {
        color: "#268bd2", // Solarized Blue
        weight: 2,
        fillColor: "#268bd2",
        fillOpacity: 0.18,
        dashArray: "4, 4",
      })
        .bindTooltip(
          "<div class='font-mono text-xs font-bold text-blue-900'>Statutory 60m RoW Alignment (NHAI)</div>",
          { sticky: true }
        )
        .addTo(rowBufferLayer);

      rowBufferLayer.addTo(map);
    }

    // 2. Cadastral Revenue Parcels (Khasra Polygons)
    if (activeLayers.cadastralBoundaries) {
      parcels.forEach((parcel) => {
        const isSelected = selectedParcel?.id === parcel.id;
        const isDisputed = parcel.surveyStatus === "DISPUTED";

        // Skip disputed if layer is off
        if (isDisputed && !activeLayers.disputedZones) return;

        let strokeColor = "#2aa198"; // Teal / Cyan default
        let fillColor = "#2aa198";
        let fillOpacity = 0.25;

        if (isDisputed) {
          strokeColor = "#dc322f"; // Solarized Red
          fillColor = "#dc322f";
          fillOpacity = 0.45;
        } else if (parcel.surveyStatus === "PENDING_FIELD_VISIT") {
          strokeColor = "#cb4b16"; // Solarized Orange
          fillColor = "#cb4b16";
          fillOpacity = 0.3;
        }

        if (isSelected) {
          strokeColor = "#006098";
          fillOpacity = Math.min(fillOpacity + 0.3, 0.7);
        }

        const polygon = L.polygon(parcel.coordinates, {
          color: strokeColor,
          weight: isSelected ? 3.5 : isDisputed ? 2.5 : 1.8,
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          dashArray: isDisputed ? "5, 5" : undefined,
        });

        // Popup Content
        const popupContent = `
          <div style="font-family: monospace; font-size: 11px; padding: 2px;">
            <div style="font-weight: bold; color: #006098; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 4px;">
              ${parcel.khasraNo} — ${parcel.village}
            </div>
            <div><strong>Owner:</strong> ${parcel.ownerName}</div>
            <div><strong>Area:</strong> ${parcel.areaHa} Ha (${(parcel.areaHa * 2.471).toFixed(2)} Acres)</div>
            <div><strong>Land Use:</strong> ${parcel.landUse}</div>
            <div><strong>Survey Status:</strong> <span style="color:${isDisputed ? '#dc322f' : '#2aa198'}; font-weight:bold;">${parcel.surveyStatus}</span></div>
            ${isDisputed ? `<div style="color: #dc322f; margin-top: 3px;"><strong>Sec 64:</strong> ${parcel.disputeNotes || "Title litigation hold"}</div>` : ""}
          </div>
        `;

        polygon.bindTooltip(
          `<div class='font-mono text-xs font-bold'>${parcel.khasraNo} (${parcel.areaHa} Ha)</div>`,
          { sticky: true }
        );
        polygon.bindPopup(popupContent);

        polygon.on("click", () => {
          onSelectParcel(parcel);
        });

        polygon.addTo(parcelsLayer);
      });

      parcelsLayer.addTo(map);
    }

    // 3. Forest / Eco Zone Layer
    if (activeLayers.forestZones) {
      const forestCoordinates: [number, number][] = [
        [26.885, 76.348],
        [26.890, 76.355],
        [26.886, 76.362],
        [26.880, 76.356],
        [26.885, 76.348],
      ];

      L.polygon(forestCoordinates, {
        color: "#859900", // Solarized Green
        weight: 2,
        fillColor: "#859900",
        fillOpacity: 0.35,
      })
        .bindTooltip(
          "<div class='font-mono text-xs font-bold text-green-900'>Protected Forest Boundary (Sec 10 Exemption)</div>",
          { sticky: true }
        )
        .addTo(forestLayer);

      forestLayer.addTo(map);
    }

    layersGroupRef.current = {
      parcelsLayer,
      rowBufferLayer,
      forestLayer,
    };

    // Auto-fit bounds if parcels are provided
    if (parcels.length > 0) {
      const allCoords = parcels.flatMap((p) => p.coordinates);
      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    }
  }, [parcels, selectedParcel, onSelectParcel, activeLayers]);

  // Pan to selected parcel center
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && selectedParcel?.center) {
      map.flyTo(selectedParcel.center, 16, { duration: 0.8 });
    }
  }, [selectedParcel]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden relative z-0">
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />
    </div>
  );
}
