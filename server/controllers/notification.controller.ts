import NotificationModel from '../models/notification.Model';
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import cron  from 'node-cron';

export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({
            createdAt: -1
        });

        res.status(201).json({
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
        
        const notifications = await NotificationModel.find().sort({
            createdAt: -1
        });
        res.status(201).json({
            message: "Notificación actualizada exitosamente",
            success: true,
            notifications,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// cron.schedule('*/5 * * * * *', function() {
//     console.log('------------');
//     console.log('running cron');
// })

cron.schedule('0 0 0 * * * ', async() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({
        status: "read",
        createdAt: {
            $lt: thirtyDaysAgo,
        }
    });
    console.log("Notificaciones antiguas eliminadas");
});
