import { config } from "dotenv";
import path from "path";
import { existsSync } from "fs";
import { PrismaClient } from "../generated/prisma/client.js";

// Load packages/db/.env so DATABASE_URL is set when apps import @repo/db
const envPaths = [
  path.resolve(process.cwd(), "packages/db/.env"),
  path.resolve(process.cwd(), "../../packages/db/.env"),
];
const envPath = envPaths.find((p) => existsSync(p));
if (envPath) config({ path: envPath });

export const prismaClient = new PrismaClient();