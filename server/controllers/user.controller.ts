import { CatchAsyncError } from './../middleware/catchAsyncError';
import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendEmail from '../utils/sendMail';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '../utils/jwt';
import { redis } from '../utils/redis';
import { getUserById } from '../services/user.service';
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
    const { name, email, password } = req.body;

    // Verifica si el correo ya está registrado en la base de datos
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) { // Si el correo ya existe, se retorna un error
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
        const newUser = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as Secret
        ) as { user: IUser; activationCode: string };

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
        await userModel.create({ name, email, password });

        // Responde con éxito si la cuenta se ha activado correctamente
        res.status(201).json({ success: true });
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
    const { email, password } = req.body as ILoginBody;

    // Verifica que ambos campos estén presentes
    if (!email || !password) {
        return next(new ErrorHandler("Por favor, ingrese su correo electrónico y contraseña.", 400));
    }

    // Busca el usuario en la base de datos con su email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user || !(await user.comparePasswords(password))) {
        return next(new ErrorHandler("Correo electrónico o contraseña incorrectos.", 400));
    }
    
    // Envía el token de autenticación
    sendToken(user, 200, res);
});

// Controlador para cerrar sesión de usuario
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Elimina las cookies de autenticación estableciendo un valor vacío y una expiración inmediata
        res.cookie('access_token', "", { maxAge: 1 });
        res.cookie('refresh_token', "", { maxAge: 1 });

        // Elimina la sesión del usuario en Redis
        const userId = req.user?._id?.toString() || '';
        await redis.del(userId);

        // Responde con un mensaje de éxito indicando que la sesión ha finalizado
        res.status(200).json({ success: true, message: 'Sesión finalizada exitosamente.' });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// Actualizar token de acceso
export const updateAccessToken = CatchAsyncError(async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(refresh_token,
            process.env.REFRESH_TOKEN as string) as { id: string };

        const message = 'Error no se pudo actualizar el token'
        if (!decoded) {
            return next(new ErrorHandler(message, 400));
        }

        const sesion = await redis.get(decoded.id as string);
        if (!sesion) {
            return next(new ErrorHandler(message, 400));
        }
        
        const user = JSON.parse(sesion);

        const accessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN as string, {
            expiresIn: '5m'
        });

        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN as string, {
            expiresIn: '3d'
        });

        req.user = user;

        res.cookie('access_token', accessToken, accessTokenOptions);
        res.cookie('refresh_token', refreshToken, refreshTokenOptions );

        res.status(200).json({
            success: 'Success',
            accessToken,
        });

    } catch (error: any) {
        console.error("Error en actualizar token de acceso:", error);
        return next(new ErrorHandler(error.message, 400));
    }
});

// Controlador para obtener la información del usuario
export const getUserInfo = CatchAsyncError(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?._id?.toString() || '';
        getUserById(userId, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string;
}



// Social authorization
export const socialAuth = CatchAsyncError(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const { email, name, avatar } = req.body as ISocialAuthBody;
        const user = await userModel.findOne({ email });
        if (!user) {
            const newUser = await userModel.create({ email, name, avatar });
            sendToken(newUser, 200, res);
        } else {
            sendToken(user, 200, res);
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Actualizar información de usuario
interface IUpdateUserInfo {
    name?: string;
    email?: string;
}

export const updateUserInfo = CatchAsyncError(async (
    req: Request,
    res: Response,
    next: NextFunction
)=> {
    try {
        const { name, email } = req.body as IUpdateUserInfo;
        const userId = req.user?.id;
        const user = await userModel.findOne(userId);

        if (email && user) {
            const isEmailExist = await userModel.findOne({email});
            if (isEmailExist) {
                return next(new ErrorHandler("El correo electrónico ya está en uso.", 400));
            }
            user.email = email;
        }

        if (name && user) {
            user.name = name;
        }

        await user?.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(201).json(
            {
                success: true,
                message: "Información del usuario actualizada correctamente",
                user,
            }
        )

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    } 
});

// Actualizar contraseña
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export const updatePassword = CatchAsyncError(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePassword;

        if( !oldPassword || !newPassword) {
            return next(new ErrorHandler("Los campos estan vacios, porfavor introduzca su contraseña antigua y la nueva",400))
        }

        const user = await userModel.findById(req.user?._id).select("+password")
        const isPasswordMatch = await user?.comparePasswords(oldPassword);

        if(user?.password == undefined) {
            return next(new ErrorHandler("Usuario o contraseña invalda, debes ingresar la contraseña actual", 400));
        }
        
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Contraseña antigua no válida o incorrecta", 400));
        }

        user?.password = newPassword;

        await user?.save();

        await redis.set(user?._id, JSON.stringify(user));

        res.status(201).json({
            success: true,
            message: "Contraseña actualizada correctamente",
            user,
        });

    
    } catch (error: any){
        return next(new ErrorHandler(error.message, 400));
    }
})