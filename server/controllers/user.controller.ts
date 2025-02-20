import { Request, Response, NextFunction } from 'express';
import userModel from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import jwt, { Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendEmail from '../utils/sendMail';
require('dotenv').config();

// Interfaz para la estructura del cuerpo de la solicitud de registro
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

// Controlador para registrar un usuario
export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // Verifica si el correo ya está registrado
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {  // Si el correo ya existe, se retorna el error
            return next(new ErrorHandler("El correo electrónico ya está registrado.", 400));
        }

        // Crea un objeto usuario con los datos recibidos
        const user: IRegistrationBody = {
            name,
            email,
            password,
        };

        // Genera un token de activación para validar el correo
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };

        // Renderiza la plantilla de correo de activación
        // (la variable 'html' se puede usar si se quiere enviar el contenido renderizado directamente)
        const html = await ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Activación de cuenta',
                template: 'activation-mail.ejs',
                data,
            });
            res.status(201).json({
                success: true,
                message: `Please check your emails: ${user.email} to activate your account`,
                activationToken: activationToken.token,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Interfaz para la estructura del token de activación
interface IActivationToken {
    token: string;
    activationCode: string;
}

// Función para crear un token de activación
export const createActivationToken = (user: any): IActivationToken => {
    // Genera un código de activación de 4 dígitos aleatorio
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Crea un token JWT con el usuario y código de activación
    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m", // El token expira en 5 minutos
        }
    );

    return { token, activationCode };
};
