import express, { type Application } from "express";
import { healthHandler } from "./health.js";
import { roomsRouter } from "./room.js";

export function configureApp(app: Application): void {
  app.use(express.json());
  app.get("/api/health", healthHandler);
  app.use("/api/rooms", roomsRouter);
}
