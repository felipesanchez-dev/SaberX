import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require('dotenv').config();

// Expresión regular para validar correos electrónicos
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interfaz del usuario con métodos adicionales
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePasswords: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "El nombre es requerido."],
        },
        email: {
            type: String,
            required: [true, "El correo electrónico es requerido."],
            validate: {
                validator: (value: string) => emailRegexPattern.test(value),
                message: "El correo electrónico no es válido.",
            },
            unique: true,
        },
        password: {
            type: String,
            required: [true, "La contraseña es requerida."],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
            select: false, // No se devuelve la contraseña en las consultas por defecto
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        courses: [{ courseId: String }],
    },
    { timestamps: true }
);

// Hashear la contraseña antes de guardar el usuario
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Token de acceso para iniciar sesion
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '', {
        expiresIn: '5m',
    });
};

// Token de refresco para iniciar sesion
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '',{
        expiresIn: '3d',
    });
}

// Método para comparar contraseñas
userSchema.methods.comparePasswords = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
