import express from 'express';
import { activateUser, loginUser, logoutUser, registrationUser } from '../controllers/user.controller';

const userRouter = express.Router();

// Ruta para el registro de usuario
userRouter.post('/registration', registrationUser);

// Ruta para la activación de cuenta
userRouter.post('/activate-user', activateUser);

// Ruta para el inicio de sesión
userRouter.post('/login', loginUser);

// Ruta para cerrar de sesión
userRouter.get('/logout', logoutUser);

export default userRouter;
