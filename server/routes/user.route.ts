import express from 'express';
import { activateUser, registrationUser } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser); //Registro de usuario

userRouter.post('/activate-user', activateUser); // activacion de usuario

export default userRouter;