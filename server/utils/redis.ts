import { Redis } from 'ioredis';
require('dotenv').config();

const redisClient = () => {
    if(process.env.REDIS_URL) {
        console.log('Conexion a redis exitosa');
        return process.env.REDIS_URL;
    };
    throw new Error('No se pudo conectar a redis');
};
export const redis = new Redis(redisClient());