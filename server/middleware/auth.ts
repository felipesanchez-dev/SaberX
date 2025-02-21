import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from './catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import jwt from 'jsonwebtoken';
import { redis } from '../utils/redis';

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler("Inicie sesión para acceder a este recurso.", 400));
    };

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string);
    if (!decoded) {
        return next(new ErrorHandler("El token de acceso no es válido", 400));
    };

    const user = await redis.get(decoded.id); //Se tiene error de tipado en el id
    if (!user) {
        return next(new ErrorHandler("Usuario no encontrado", 400));
    };

    req.user = JSON.parse(user);
    next();
});