import express from 'express';
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updatePassword, updateUserInfo } from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

// Ruta para el registro de usuario
userRouter.post('/registration', registrationUser);

// Ruta para la activación de cuenta
userRouter.post('/activate-user', activateUser);

// Ruta para el inicio de sesión
userRouter.post('/login', loginUser);

// Ruta para cerrar sesión del usuario autenticado
userRouter.get('/logout', isAuthenticated, logoutUser);
// userRouter.get('/logout', isAuthenticated, authorizeRoles('admin'), logoutUser); // Alternativa con roles

// Ruta para refrescar el token de acceso
userRouter.get('/refresh', updateAccessToken);

// Ruta para obtener la información del usuario autenticado
userRouter.get('/me', isAuthenticated, getUserInfo);

// Ruta para autenticación social sin contraseña
userRouter.post('/social-auth', socialAuth);

// Ruta para actualizar la información del usuario autenticado
userRouter.put('/update-user-info', isAuthenticated, updateUserInfo);

// Ruta para actualizar la contraseña del usuario autenticado
userRouter.put('/update-user-password', isAuthenticated, updatePassword);

export default userRouter;