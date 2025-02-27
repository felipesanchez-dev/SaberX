import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, {IOrder} from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendEmail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";


export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;

        const user = await userModel.findById(req.user?._id);

        const courseExistInUser = user?.courses.some((course: any) => course._id.toString() === courseId);

        if (!courseExistInUser) {
            return next(new ErrorHandler("Usted ya cuenta con este curso", 400));
        };

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Curso no encontrado", 404));
        };

        const data:any = {
            courseId: course._id,
            userId: user?._id,
        };

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})