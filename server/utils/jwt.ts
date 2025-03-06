import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
require("dotenv").config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || "300",
  10
);

const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || "1200",
  10
);

if (isNaN(accessTokenExpire) || isNaN(refreshTokenExpire)) {
  throw new Error(
    "Las variables de entorno ACCESS_TOKEN_EXPIRES o REFRESH_TOKEN_EXPIRES no son válidas"
  );
}

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  try {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error("No se pudieron generar los tokens");
    }

    redis.set(String(user._id), JSON.stringify(user)).catch((err) => {
      console.error("Error al guardar sesión en Redis:", err);
    });

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Error en sendToken:", error);
    res.status(500).json({
      success: false,
      message: "Error al generar el token",
    });
  }
};
