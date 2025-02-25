import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
require('dotenv').config();

export const app = express();
// Middleware para analizar JSON en las solicitudes
app.use(express.json({ limit: '50mb' }));

// Middleware para manejar cookies
app.use(cookieParser());

// Configuración de CORS para permitir solicitudes desde el origen definido en .env
app.use(cors({
    origin: process.env.ORIGIN,
}));


// Ruta principal para las rutas API
app.use('/api/v1', userRouter); //Autenticación y Seguridad Usuario

app.use('/api/v1', courseRouter); // General cursos

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
});

// Manejo de rutas desconocidas
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
});

app.use(ErrorMiddleware);