import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import OrderModel from "../models/order.Model";

export const newOrder = async (data: any, res: Response, next: NextFunction) => {
    try {
        const order = await OrderModel.create(data);
        res.status(201).json({
            message: "Pedido creado exitosamente",
            success: true,
            order,
        });
    } catch (error: any) {
        next(error);
    }
};


// export const newOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const { courseId, userId, payment_info } = req.body;
    
//     const order = await OrderModel.create({ courseId, userId, payment_info });

//     res.status(201).json({
//         message: "Pedido creado exitosamente",
//         success: true,
//         order,
//     });
// });
