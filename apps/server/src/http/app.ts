import express, { type Application } from "express";
import { healthHandler } from "./health.js";

export function configureApp(app: Application): void {
  app.use(express.json());
  app.get("/api/health", healthHandler);
}
