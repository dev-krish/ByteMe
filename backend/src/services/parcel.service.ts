import { prisma } from "../config/database.js";
import { appendAuditLog } from "./audit.service.js";

/**
 * Parcel Service — CRUD + PostGIS spatial operations.
 * Handles geometry insertion, spatial queries, and RoW buffer computation.
 */

/**
 * Create a parcel and insert PostGIS geometry.
 */
export async function createParcel(
  data: {
    projectId: string;
    khasraNumber: string;
    village: string;
    tehsil: string;
    district: string;
    state: string;
    areaHa: number;
    landUse?: string;
    soilClassification?: string;
    ownerName: string;
    aadhaarLinked?: boolean;
    panNo?: string;
    circleRatePerHa: number;
    saleDeedAvgRatePerHa: number;
    coordinates: [number, number][]; // [lat, lng][] polygon ring
    structuresCount?: number;
    treesCount?: number;
  },
  actorId: string
) {
  // Convert [lat, lng] to [lng, lat] for GeoJSON spec (GeoJSON uses lng, lat)
  const geoJsonCoords = data.coordinates.map(([lat, lng]) => [lng, lat]);
  // Ensure the ring is closed
  if (
    geoJsonCoords.length > 0 &&
    (geoJsonCoords[0][0] !== geoJsonCoords[geoJsonCoords.length - 1][0] ||
      geoJsonCoords[0][1] !== geoJsonCoords[geoJsonCoords.length - 1][1])
  ) {
    geoJsonCoords.push(geoJsonCoords[0]);
  }

  // Compute center from coordinates (simple centroid)
  const centerLat =
    data.coordinates.reduce((sum, c) => sum + c[0], 0) /
    data.coordinates.length;
  const centerLng =
    data.coordinates.reduce((sum, c) => sum + c[1], 0) /
    data.coordinates.length;

  const parcel = await prisma.$transaction(async (tx) => {
    const p = await tx.parcel.create({
      data: {
        projectId: data.projectId,
        khasraNumber: data.khasraNumber,
        village: data.village,
        tehsil: data.tehsil,
        district: data.district,
        state: data.state,
        areaHa: data.areaHa,
        landUse: (data.landUse as any) || "AGRICULTURAL",
        soilClassification: (data.soilClassification as any) || "IRRIGATED",
        ownerName: data.ownerName,
        aadhaarLinked: data.aadhaarLinked ?? false,
        panNo: data.panNo,
        circleRatePerHa: data.circleRatePerHa,
        saleDeedAvgRatePerHa: data.saleDeedAvgRatePerHa,
        coordinatesJson: data.coordinates,
        centerLat,
        centerLng,
        structuresCount: data.structuresCount ?? 0,
        treesCount: data.treesCount ?? 0,
      },
    });

    // Insert PostGIS geometry column via raw SQL
    // Note: This requires the `geometry` column to exist (added via migration)
    try {
      const geoJson = JSON.stringify({
        type: "Polygon",
        coordinates: [geoJsonCoords],
      });
      await tx.$executeRawUnsafe(
        `UPDATE parcels SET geometry = ST_SetSRID(ST_GeomFromGeoJSON($1), 4326) WHERE id = $2`,
        geoJson,
        p.id
      );
    } catch {
      // PostGIS geometry column may not exist yet — gracefully skip
      console.warn(
        "⚠ PostGIS geometry column not found — spatial queries will use JSON coordinates."
      );
    }

    await appendAuditLog(
      {
        entityType: "PARCEL",
        entityId: p.id,
        action: "CREATE",
        actorId,
        payload: {
          khasraNumber: p.khasraNumber,
          village: p.village,
          projectId: p.projectId,
          areaHa: p.areaHa,
        },
      },
      tx
    );

    return p;
  });

  return parcel;
}

/**
 * Spatial query — find parcels within a bounding box.
 * Falls back to JSON coordinate filtering if PostGIS is unavailable.
 */
export async function queryParcelsByBBox(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number
) {
  try {
    // Try PostGIS spatial query first
    const parcels = await prisma.$queryRawUnsafe<any[]>(
      `SELECT p.*, ST_AsGeoJSON(p.geometry) as geojson
       FROM parcels p
       WHERE ST_Intersects(
         p.geometry,
         ST_MakeEnvelope($1, $2, $3, $4, 4326)
       )`,
      minLng,
      minLat,
      maxLng,
      maxLat
    );
    return parcels;
  } catch {
    // Fallback: filter by center coordinates
    const parcels = await prisma.parcel.findMany({
      where: {
        centerLat: { gte: minLat, lte: maxLat },
        centerLng: { gte: minLng, lte: maxLng },
      },
    });
    return parcels;
  }
}

/**
 * Query parcels by village/khasra text search.
 */
export async function queryParcelsByText(query: string) {
  return prisma.parcel.findMany({
    where: {
      OR: [
        { khasraNumber: { contains: query, mode: "insensitive" } },
        { village: { contains: query, mode: "insensitive" } },
        { ownerName: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      valuations: { select: { totalAward: true } },
    },
  });
}

/**
 * Compute 60m Right-of-Way buffer using PostGIS ST_Buffer.
 * Returns the buffer as a GeoJSON polygon.
 */
export async function computeRoWBuffer(parcelId: string) {
  try {
    const result = await prisma.$queryRawUnsafe<
      Array<{ buffer_geojson: string }>
    >(
      `SELECT ST_AsGeoJSON(
        ST_Buffer(geometry::geography, 60)::geometry
      ) as buffer_geojson
      FROM parcels
      WHERE id = $1`,
      parcelId
    );

    if (result.length === 0) return null;
    return JSON.parse(result[0].buffer_geojson);
  } catch {
    // Fallback: return a simplified buffer indicator
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
    });
    if (!parcel) return null;

    // Approximate 60m buffer by expanding coordinates slightly (~0.00054 degrees)
    const coords = parcel.coordinatesJson as [number, number][];
    const bufferDeg = 0.00054; // ~60m at equator
    const buffered = coords.map(([lat, lng]) => [
      [lat + bufferDeg, lng + bufferDeg],
      [lat + bufferDeg, lng - bufferDeg],
      [lat - bufferDeg, lng - bufferDeg],
      [lat - bufferDeg, lng + bufferDeg],
    ]);

    return {
      type: "Polygon",
      coordinates: [buffered.flat()],
      note: "Approximate buffer — PostGIS not available",
    };
  }
}

/**
 * Get parcel litigation/title status.
 */
export async function getParcelLitigation(parcelId: string) {
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId },
    select: {
      id: true,
      khasraNumber: true,
      titleStatus: true,
      surveyStatus: true,
      disputeNotes: true,
      litigationReference: true,
      compensationStatus: true,
      objections: true,
    },
  });

  return parcel;
}

/**
 * Convert parcels to GeoJSON FeatureCollection for the GIS map.
 */
export function toGeoJSON(parcels: any[]) {
  return {
    type: "FeatureCollection" as const,
    features: parcels.map((p) => {
      const coords = (p.coordinatesJson || p.coordinates_json) as [number, number][];
      // Convert [lat, lng] to [lng, lat] for GeoJSON spec
      const geoJsonCoords = coords?.map(([lat, lng]) => [lng, lat]) ?? [];

      return {
        type: "Feature" as const,
        id: p.id,
        geometry: {
          type: "Polygon" as const,
          coordinates: [geoJsonCoords],
        },
        properties: {
          id: p.id,
          khasraNo: p.khasraNumber || p.khasra_number,
          village: p.village,
          tehsil: p.tehsil,
          district: p.district,
          areaHa: p.areaHa || p.area_ha,
          ownerName: p.ownerName || p.owner_name,
          titleStatus: p.titleStatus || p.title_status,
          surveyStatus: p.surveyStatus || p.survey_status,
          compensationStatus: p.compensationStatus || p.compensation_status,
          awardedAmountLakhs: p.awardedAmountLakhs || p.awarded_amount_lakhs,
          landUse: p.landUse || p.land_use,
        },
      };
    }),
  };
}
