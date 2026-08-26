import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { startSLACron } from "./engine/sla-cron.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import gisRoutes from "./routes/gis.routes.js";
import valuationRoutes from "./routes/valuation.routes.js";
import dbtRoutes from "./routes/dbt.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import receiptRoutes from "./routes/receipts.routes.js";

const app = express();

// Security & Parsing
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(","),
    credentials: true,
  })
);

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/gis", gisRoutes);
app.use("/api/valuation", valuationRoutes);
app.use("/api/dbt", dbtRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/receipts", receiptRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(env.PORT, () => {
  console.log(`🚀 NLAMS Backend running at http://localhost:${env.PORT}`);
  console.log(`🌍 CORS enabled for: ${env.CORS_ORIGINS}`);

  // Start background jobs
  startSLACron();
});
