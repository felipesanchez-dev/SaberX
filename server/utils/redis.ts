import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisUrl: string | undefined = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("❌ Error: La URL de Redis (REDIS_URL) no está definida.");
  process.exit(1);
}

export const redis = new Redis(redisUrl, {
  retryStrategy: (times: number) => {
    console.warn(`🔄 Reintentando conexión a Redis (${times})...`);
    return Math.min(times * 100, 3000);
  },
  reconnectOnError: (err: Error) => {
    console.error("⚠️ Error crítico en Redis:", err);
    return true;
  },
});

redis.on("connect", () =>
  console.log("✅ Conexión a Redis establecida correctamente.")
);
redis.on("ready", () =>
  console.log("🚀 Redis está listo para recibir comandos.")
);
redis.on("reconnecting", (time: number) =>
  console.log(`🔄 Intentando reconectar a Redis (espera: ${time} ms)`)
);
redis.on("error", (err: Error) => console.error("❌ Error en Redis:", err));
redis.on("end", () => console.warn("⚠️ Conexión con Redis cerrada."));

// Función para probar la conexión
const testRedisConnection = async () => {
  try {
    console.log("🔍 Test de Redis: ");
  } catch (error) {
    console.error("❌ Fallo en la prueba de Redis:", error);
  }
};

testRedisConnection();
