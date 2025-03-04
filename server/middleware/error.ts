import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err, message: err.message };
    error.statusCode = err.statusCode || 500;

    if (err.name === "CastError") {
        error = new ErrorHandler(`❌ Recurso no encontrado. ID inválido: ${err.path}`, 400);
    };

    if (err.code === 11000) {
        error = new ErrorHandler(`⚠️ Clave duplicada: ${Object.keys(err.keyValue).join(", ")} ingresada`, 400);
    };

    if (err.name === "JsonWebTokenError") {
        error = new ErrorHandler("🚫 Token JWT inválido. ¡Intenta nuevamente!", 401);
    };

    if (err.name === "TokenExpiredError") {
        error = new ErrorHandler("⏳ Token JWT expirado. ¡Intenta nuevamente!", 400);
    };

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
};
