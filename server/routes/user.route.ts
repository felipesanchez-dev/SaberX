import express from 'express';
import { activateUser, loginUser, logoutUser, registrationUser } from '../controllers/user.controller';
import { isAutheticated } from '../middleware/auth';

const userRouter = express.Router();

// Ruta para el registro de usuario
userRouter.post('/registration', registrationUser);

// Ruta para la activación de cuenta
userRouter.post('/activate-user', activateUser);

// Ruta para el inicio de sesión
userRouter.post('/login', loginUser);

// Ruta para cerrar sesión
userRouter.get('/logout', isAutheticated, logoutUser);


export default userRouter;
