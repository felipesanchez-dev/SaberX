import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./catchAsyncError";
require('dotenv').config();


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { access_token } = req.cookies;

        if (!access_token) {
            return next(new ErrorHandler("Por favor, inicie sesión", 401));
        }

        const secretKey = process.env.ACCESS_TOKEN;
        if (!secretKey) {
            console.error("Falta la variable de entorno ACCESS_TOKEN");
            return next(new ErrorHandler("Error interno del servidor", 500));
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(access_token, secretKey) as JwtPayload;
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return next(new ErrorHandler("El token ha expirado, por favor inicie sesión nuevamente", 401));
            }
            return next(new ErrorHandler("El token de acceso no es válido", 400));
        }

        if (!decoded || !decoded.id) {
            return next(new ErrorHandler("El token de acceso no contiene información válida", 400));
        }

        const user = await redis.get(String(decoded.id));
        if (!user) {
            return next(new ErrorHandler("Usuario no encontrado o sesión expirada", 404));
        }

        req.user = JSON.parse(user); 
        next(); 

    } catch (error) {
        console.error("Error en autenticación:", error);
        return next(new ErrorHandler("Error en la autenticación", 500));
    }
};


export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`El rol ${req.user?.role} no está autorizado para acceder a esta ruta`, 403));
        }
        next();
    }
};