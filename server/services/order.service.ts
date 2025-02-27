import { Request, Response, NextFunction } from "express";
import OrderModel from "../models/order.Model";

export const newOrder = async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
        res.status(201).json({
            message: "Pedido creado exitosamente",
            success: true,
            order,
    });
};

export const getAllOrdersService = async (res: Response) => {
    const orders = await OrderModel.find().sort({
        createdAt: -1
    });

    res.status(201).json({
        success: true,
        orders,
    });
};