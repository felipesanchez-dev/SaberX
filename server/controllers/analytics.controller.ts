import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import { generateLast12MothsData } from '../utils/analytics.generator';
import userModel from '../models/user.model';

export const getUsersAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MothsData(userModel);
        res.status(200).json({
            message: 'Analisis de usuarios por mes obtenido exitosamente',
            success: true,
            users,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
