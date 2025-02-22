import express from 'express';
import { activateUser, loginUser, logoutUser, registrationUser } from '../controllers/user.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

// Ruta para el registro de usuario
userRouter.post('/registration', registrationUser);

// Ruta para la activación de cuenta
userRouter.post('/activate-user', activateUser);

// Ruta para el inicio de sesión
userRouter.post('/login', loginUser);

// Ruta para cerrar de sesión
userRouter.get('/logout', isAuthenticated, logoutUser);
// userRouter.get('/logout', isAuthenticated, authorizeRoles('admin'), logoutUser);

export default userRouter;
