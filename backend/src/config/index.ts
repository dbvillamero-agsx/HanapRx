import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-me",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
