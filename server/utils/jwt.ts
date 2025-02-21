import { Response } from 'express';
import { IUser } from '../models/user.model';
import { redis } from './redis';
require('dotenv').config();

interface ITokenOptions {
    expire: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}

// Función para enviar tokens de autenticación en cookies
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SingnAccessToken(); // Genera el token de acceso
    const refreshToken = user.SingnRefreshToken(); // Genera el token de refresco

    // Guarda la sesión del usuario en Redis
    redis.set(String(user._id), JSON.stringify(user));

    // Configura tiempos de expiración desde las variables de entorno
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRES || '300', 10);
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRES || '1200', 10);

    // Configuración de la cookie del token de acceso
    const accessTokenOptions: ITokenOptions = {
        expire: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    };

    // Configuración de la cookie del token de refresco
    const refreshTokenOptions: ITokenOptions = {
        expire: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: refreshTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    };

    // Asegura que las cookies sean seguras solo en producción
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }

    // Establece las cookies en la respuesta
    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    // Responde con éxito y envía los tokens al cliente
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
}
