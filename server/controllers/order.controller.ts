import { newOrder } from './../services/order.service';
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

        if (courseExistInUser) {
            return next(new ErrorHandler("El usuario ya tiene este curso en su cuenta", 400));
        };        

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Curso no encontrado", 404));
        };

        const data:any = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        };

        const mailData = {
            order: {
                _id: (course._id as any).toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
        };
        
        const html = await ejs.renderFile(path.join(__dirname, '../mails/order-confirmation.ejs'),{order:mailData});
        try {
            if (user) {
                await sendEmail({
                    email: user.email,
                    subject: '🎉 ¡Felicidades! Tus cursos han sido agregados con éxito 🚀',
                    template: 'order-confirmation.ejs',
                    data: mailData,
                });
            }

        } catch (error: any) {
            console.error("Error al enviar correo de confirmación de orden:", error);
            return next(new ErrorHandler(error.message, 500));
        }

        user?.courses.push({ courseId: String(course?._id) });

        await user?.save();

        const notification = await NotificationModel.create({
            user: user?._id,
            title: "Nueva Orden",
            message: `Tienes un nuevo pedido de ${course?.name}`,
        });

        course.purchased ? course.purchased += 1 : course.purchased;
        // if (course.purchased) {
        //     course.purchased += 1;
        // };
        
        await course.save();
        await newOrder(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})