import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userModel from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';

export const isAutheticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return next(new ErrorHandler("Por favor, inicie sesión para acceder a esta ruta.", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return next(new ErrorHandler("Usuario no encontrado.", 404));
        }

        req.user = user; // Asigna el usuario a la solicitud
        next();
    } catch (error) {
        return next(new ErrorHandler("Token inválido o expirado.", 401));
    }
};
