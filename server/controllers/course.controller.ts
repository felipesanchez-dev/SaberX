import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary'
import { createCourse, getAllCoursesService } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';
import mongoose from 'mongoose';
import ejs from 'ejs';
import path from 'path';
import sendEmail from '../utils/sendMail';
import NotificationModel from '../models/notification.Model';

export const uploadCourse = CatchAsyncError(async ( req: Request, res: Response, next: NextFunction)=> {
    try{
        const data = req.body;
        const thumbnail = data.thumbnail
        if(thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
        createCourse(data,res,next);

    } catch (error: any){
        return next(new ErrorHandler(error.message, 500));
    }
});

export const editCourse = CatchAsyncError(async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id); 
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses" 
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const courseId = req.params.id;

        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true }
        );

        res.status(200).json({
            message: 'Curso editado exitosamente',
            success: true,
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); 
    }
});

export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        const isCacheExist = await redis.get(courseId);

        if (isCacheExist) {
            try {
                const course = JSON.parse(isCacheExist);
                return res.status(200).json({
                    success: true,
                    message: "Curso cargado desde la memoria del caché (Se evitó una consulta a la base de datos innecesaria)",
                    cached: true,
                    course,
                });
            } catch (error) {
                console.error("Error al parsear datos de Redis:", error);
            }
        }

        const course = await CourseModel.findById(courseId).select(
            '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links'
        );

        if (!course) {
            return res.status(404).json({
                message: 'Curso no encontrado',
                success: false,
            });
        }

        await redis.setex(courseId, 3600, JSON.stringify(course));

        res.status(200).json({
            message: 'Curso obtenido exitosamente',
            success: true,
            cached: false,
            course,
        });

    } catch (error: any) {
        console.error("Error en getSingleCourse:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get('allCourses');

        if (isCacheExist) {
            try {
                const courses = JSON.parse(isCacheExist);
                return res.status(200).json({
                    success: true,
                    message: "Cursos cargados desde la memoria del caché (Se evitó una consulta a la base de datos innecesaria)",
                    cached: true,
                    courses,
                });
            } catch (error) {
                console.error("Error al parsear datos de Redis:", error);
            }
        }

        const courses = await CourseModel.find().select(
            '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links'
        );

        if (!courses.length) {
            return res.status(404).json({
                message: 'No hay cursos disponibles',
                success: false,
            });
        }

        await redis.setex('allCourses', 3600, JSON.stringify(courses));

        return res.status(200).json({
            message: 'Cursos obtenidos exitosamente',
            success: true,
            cached: false,
            courses,
        });

    } catch (error: any) {
        console.error("Error en getAllCourses:", error);
        return next(new ErrorHandler(error.message, 500)); 
    }
});
export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses || [];
        const courseId = req.params.id;

        const courseExists = userCourseList.find((course: any) => course._id.toString() === courseId);

        if (!courseExists) {
            return next(new ErrorHandler("No eres elegible para acceder a este curso", 403)); 
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Curso no encontrado", 404));
        }

        return res.status(200).json({
            message: 'Contenido del curso obtenido exitosamente',
            success: true,
            content: course.courseData,
        });
    } catch (error: any) {
        console.error("Error en getCourseByUser:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddQuestionData {
    question: string; 
    courseId: string; 
    contentId: string; 
}

export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: IAddQuestionData = req.body;

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("El contenido no tiene un ID válido", 400)); // Error 400 (Bad Request)
        }

        const courseContent = ((course?.courseData as unknown) as any[])?.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("El curso no contiene este contenido", 404));
        }

        const newQuestion: any = {
            user: req.user,   
            question,
            questionReplices: [], 
        };

        courseContent.questions.push(newQuestion);

        await NotificationModel.create({
            user: req.user?._id,
            title: "Nuevo mensaje",
            message: `Tienes una notificacion de ${courseContent.title}`,
        });

        await course?.save();

        res.status(200).json({
            message: 'Pregunta añadida exitosamente',
            success: true,
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddAnswerData {
    answer: string,  
    courseId: string, 
    contentId: string,
    questionId: string,
}

export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("El contenido no tiene un ID válido", 400)); 
        };
        
        const courseContent = ((course?.courseData as unknown) as any[])?.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler("El curso no contiene este contenido", 404)); 
        };

        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

        if (!question) {
            return next(new ErrorHandler("El curso no contiene esta pregunta", 404)); 
        };

        const newAnswer: any = {
            user: req.user,
            answer,
        };

        question.questionReplices.push(newAnswer);

        await course?.save();
        
        if (req.user?.id === question.user._id) {
            await NotificationModel.create({
                user: req.user?._id,
                title: "Nueva respuesta",
                message: `Tienes una nueva respuesta en ${courseContent.title}`,
            });
            
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title, 
            };

            const html = await ejs.renderFile(path.join(__dirname, '../mails/question-reply.ejs'), data);

            try {
                await sendEmail({
                    email: question.user.email,
                    subject: 'Se ha añadido respuesta a tu pregunta en uno de nuestros cursos',
                    template: 'question-reply.ejs',
                    data,
                });

            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500));
            }

            res.status(200).json({
                message: 'Respuesta añadida exitosamente, se ha enviado un mensaje de notificación',
                success: true,
                course,
            });
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddReviewData {
    review: string,
    courseId: string,
    rating: number, 
    userId: string, 
}
export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses; 
        const courseId = req.params.id; 

        const courseExists = userCourseList?.some((course: any) => course._id.toString() === courseId.toString());
        
        if (!courseExists) {
            return next(new ErrorHandler("Usted no tiene acceso válido a este curso", 404)); 
        };

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Curso no encontrado", 404));
        }

        const { review, rating } = req.body as IAddReviewData;

        const reviewData: any = {
            user: req.user, 
            rating,
            comment: review, 
        };

        course.reviews.push(reviewData);

        let avg = 0;
        course.reviews.forEach((rev: any) => {
            avg += rev.rating;
        });

        if (course.reviews.length > 0) {
            course.ratings = avg / course.reviews.length; 
        };

        await course.save();

        const notification = {
            title: 'Nueva Reseña Recibida',
            message: `${req.user?.name} ha dejado una reseña en el curso ${course?.name}`,
        };

        res.status(200).json({
            message: 'Reseña añadida exitosamente',
            success: true,
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IAddReviewData {
    comment: string,
    courseId: string, 
    reviewId: string, 
}

export const addReplayToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, courseId, reviewId } = req.body as IAddReviewData;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Curso no encontrado", 404)); 
        };

        const review = course.reviews?.find((rev: any) => rev._id.toString() === reviewId);

        if (!review) {
            return next(new ErrorHandler("Reseña no encontrada", 404));
        };

        const replyData: any = {
            user: req.user,
            comment, 
        };
        
        if (!review.commentReplices) {
            review.commentReplices = []; 
        }

        review.commentReplices.push(replyData);

        await course.save();

        res.status(200).json({
            message: 'Comentario añadido exitosamente',
            success: true,
            course, 
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); 
    }
});

export const getAllUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message,400));
    }
});

export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);

        if (!course) {
            return next(new ErrorHandler("El curso no existe", 404));
        }

        await course.deleteOne({id});
        await redis.del(id);
        res.status(200).json({
            success: true,
            message: "Curso fue eliminado correctamente",
            course,
        });


    }catch (error: any){
        return next(new ErrorHandler(error.message, 400));
    }
});