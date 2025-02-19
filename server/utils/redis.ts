import { Redis } from "ioredis";
require("dotenv").config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.error("❌ Error: La URL de Redis (REDIS_URL) no está definida.");
    process.exit(1); // Detiene el proceso si no hay URL de Redis
}

export const redis = new Redis(redisUrl);

redis.on("connect", () => {
    console.log("✅ Conexión exitosa a Redis");
});

redis.on("error", (error) => {
    console.error(`❌ Error en Redis: ${error.message}`);
});

