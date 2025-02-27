import { Redis } from "ioredis";
require("dotenv").config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.error("❌ Error: La URL de Redis (REDIS_URL) no está definida.");
    process.exit(1); 
}

export const redis = new Redis(redisUrl);

