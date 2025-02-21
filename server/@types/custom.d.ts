import { Request } from 'express';
import { IUser } from '../models/user.model';

// Extender la interfaz de Request para incluir el usuario autenticado
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // usuario autenticado a la solicitud
        }
    }
}
