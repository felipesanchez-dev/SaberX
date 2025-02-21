import express from 'express';
import { activateUser, LoginUser, registrationUser } from '../controllers/user.controller';

const userRouter = express.Router();

// Ruta para el registro de usuario
userRouter.post('/registration', registrationUser);

// Ruta para la activación de cuenta
userRouter.post('/activate-user', activateUser);

// Ruta para el inicio de sesión
userRouter.post('/login', LoginUser);

export default userRouter;
