import NotificationModel from '../models/notification.Model';
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';


export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({createdAt: -1});

        res.status(200).json({
            message: "Notificaciones obtenidas exitosamente",
            success: true,
            notifications,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const updateNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler("Notificación no encontrada", 404));
        } else {
            notification.status ? notification.status = 'read' : notification?.status;
        }
        
        await notification.save();
        
        const notifications = await NotificationModel.find().sort({createdAt: -1});
        res.status(200).json({
            message: "Notificación actualizada exitosamente",
            success: true,
            notifications,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})