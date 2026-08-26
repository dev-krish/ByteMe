import { Router, Request, Response } from "express";
import {
  queryParcelsByBBox,
  queryParcelsByText,
  computeRoWBuffer,
  getParcelLitigation,
  toGeoJSON,
} from "../services/parcel.service.js";
import { prisma } from "../config/database.js";

const router = Router();

/**
 * GET /api/gis/parcels
 * Spatial query — supports:
 *   ?bbox=minLat,minLng,maxLat,maxLng  → PostGIS ST_Intersects
 *   ?q=searchTerm                       → text search (khasra/owner/village)
 *   ?village=name                       → filter by village
 *
 * Returns GeoJSON FeatureCollection.
 */
router.get("/parcels", async (req: Request, res: Response) => {
  try {
    const { bbox, q, village, khasra } = req.query;

    let parcels: any[];

    if (bbox && typeof bbox === "string") {
      const [minLat, minLng, maxLat, maxLng] = bbox.split(",").map(Number);
      if ([minLat, minLng, maxLat, maxLng].some(isNaN)) {
        res.status(400).json({
          success: false,
          error: "bbox must be: minLat,minLng,maxLat,maxLng",
        });
        return;
      }
      parcels = await queryParcelsByBBox(minLat, minLng, maxLat, maxLng);
    } else if (q && typeof q === "string") {
      parcels = await queryParcelsByText(q);
    } else if (village || khasra) {
      parcels = await prisma.parcel.findMany({
        where: {
          ...(village ? { village: { contains: village as string, mode: "insensitive" as const } } : {}),
          ...(khasra
            ? { khasraNumber: { contains: khasra as string, mode: "insensitive" as const } }
            : {}),
        },
      });
    } else {
      // Return all parcels (limited for safety)
      parcels = await prisma.parcel.findMany({ take: 100 });
    }

    const geojson = toGeoJSON(parcels);
    res.json({ success: true, data: geojson });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/gis/parcels/:id/row-buffer
 * Compute 60m Right-of-Way buffer via PostGIS ST_Buffer.
 */
router.get("/parcels/:id/row-buffer", async (req: Request, res: Response) => {
  try {
    const buffer = await computeRoWBuffer(String(req.params.id));
    if (!buffer) {
      res.status(404).json({ success: false, error: "Parcel not found." });
      return;
    }

    res.json({
      success: true,
      data: {
        parcelId: req.params.id,
        bufferMeters: 60,
        geometry: buffer,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/gis/parcels/:id/litigation
 * Title/litigation status check.
 */
router.get("/parcels/:id/litigation", async (req: Request, res: Response) => {
  try {
    const result = await getParcelLitigation(String(req.params.id));
    if (!result) {
      res.status(404).json({ success: false, error: "Parcel not found." });
      return;
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
