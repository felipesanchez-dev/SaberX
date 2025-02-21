import { CatchAsyncError } from './../middleware/catchAsyncError';
import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendEmail from '../utils/sendMail';
import { sendToken } from '../utils/jwt';
require('dotenv').config();

// Interfaz para definir la estructura esperada del cuerpo de la solicitud de registro
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

        // Verifica si el correo ya está registrado en la base de datos
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {  // Si el correo ya existe, se retorna un error
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

        // Renderiza la plantilla de correo de activación con los datos del usuario
        const html = await ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data);

        try {
            // Envía el correo electrónico de activación
            await sendEmail({
                email: user.email,
                subject: 'Activación de cuenta',
                template: 'activation-mail.ejs',
                data,
            });
            
            // Responde con éxito y envía el token de activación al cliente
            res.status(201).json({
                success: true,
                message: `Por favor, revise sus correos electrónicos: ${user.email} para activar su cuenta`,
                activationToken: activationToken.token,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Interfaz para definir la estructura del token de activación
interface IActivationToken {
    token: string;
    activationCode: string;
}

// Función para generar un token de activación único para cada usuario
export const createActivationToken = (user: any): IActivationToken => {
    // Genera un código de activación de 4 dígitos aleatorio
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Crea un token JWT con el usuario y el código de activación
    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret, // Usa una clave secreta desde las variables de entorno
        {
            expiresIn: "5m", // El token expira en 5 minutos para mayor seguridad
        }
    );

    return { token, activationCode };
};

// Interfaz para definir la estructura esperada en la activación de cuenta
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

// Controlador para activar un usuario una vez que introduce el código de activación correcto
export const activateUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationRequest;

        // Verifica el token JWT y extrae el usuario y código de activación almacenado
        const newUser: {user: IUser; activationCode: string} = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as Secret
        ) as {user: IUser; activationCode: string};

        // Si el código de activación proporcionado no coincide con el guardado en el token, retorna un error
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Código de activación inválido.", 400));
        }

        const { name, email, password } = newUser.user;

        // Verifica si el usuario ya existe en la base de datos
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler("El correo electrónico ya está registrado.", 400));
        }

        // Crea el usuario en la base de datos con los datos validados
        const user = await userModel.create({
            name,
            email,
            password,
        });

        // Responde con éxito si la cuenta se ha activado correctamente
        res.status(201).json({
            success: true,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Interfaz para definir la estructura esperada del cuerpo de la solicitud de inicio de sesión
interface ILoginBody {
    email: string;
    password: string;
}

// Controlador para el inicio de sesión de usuario
export const loginUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginBody;

        // Verifica que ambos campos estén presentes
        if (!email || !password) {
            return next(new ErrorHandler("Por favor, ingrese su correo electrónico y contraseña.", 400));
        }

        // Busca el usuario en la base de datos con su email
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Correo electrónico o contraseña incorrectos.", 400));
        }

        // Compara la contraseña ingresada con la almacenada
        const isPasswordMatch = await user.comparePasswords(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Correo electrónico o contraseña incorrectos.", 400));
        }
        
        // Envía el token de autenticación
        sendToken(user, 200, res);
        console.log(user); // Test para revisar si se estan enviando los datos del usuario (Exitoso)

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Controlador para cerrar de sesión de usuario
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Elimina las cookies de autenticación estableciendo un valor vacío y una expiración inmediata
        res.cookie('access_token', "", { maxAge: 1 });
        res.cookie('refresh_token', "", { maxAge: 1 });

        // Responde con un mensaje de éxito indicando que la sesión ha finalizado
        res.status(200).json({
            success: true,
            message: 'Sesión finalizada exitosamente.'
        });
    } catch (error: any) {
        // Manejo de errores si ocurre algún problema en el proceso de cierre de sesión
        return next(new ErrorHandler(error.message, 400));
    }
});