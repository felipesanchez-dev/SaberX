import express from 'express';
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken } from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';

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

// Ruta para refrescar token
userRouter.get('/refresh', updateAccessToken);

// Ruta para obtener el usuario actual
userRouter.get('/me', isAuthenticated, getUserInfo);

// Ruta para 
userRouter.post('/social-auth', socialAuth)


export default userRouter;
