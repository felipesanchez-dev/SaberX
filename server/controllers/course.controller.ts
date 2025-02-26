import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary'
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';
import mongoose from 'mongoose';
import ejs from 'ejs';
import path from 'path';
import sendEmail from '../utils/sendMail';

// Controlador para subir y crear un curso
export const uploadCourse = CatchAsyncError(async ( req: Request, res: Response, next: NextFunction)=> {
    try{
        const data = req.body;
        const thumbnail = data.thumbnail
            // Si se proporciona una miniatura, se sube a Cloudinary
        if(thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });
            // Se guarda la información del thumbnail en el curso
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
        // Llamado al servicio para crear el curso con los datos procesados
        createCourse(data,res,next);

    // Manejo de errores en caso de algun fallo
    } catch (error: any){
        return next(new ErrorHandler(error.message, 500));
    }
});

// Controlador para editar un curso
export const editCourse = CatchAsyncError(async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        // Si se proporciona una nueva miniatura, se elimina la anterior y se sube la nueva
        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id); // Elimina la imagen anterior de Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses" // Se almacena en la carpeta "courses"
            });

            // Se actualiza la información del thumbnail en el curso
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        // Obtiene el ID del curso desde los parámetros de la URL
        const courseId = req.params.id;

        // Busca y actualiza el curso en la base de datos
        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true } // Retorna el documento actualizado
        );

        res.status(200).json({
            message: 'Curso editado exitosamente',
            success: true,
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores
    }
});

// Controlador para obtener un solo curso por su ID (con caché en Redis para optimizar rendimiento)
export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        // Verifica si el curso ya está en caché para evitar consultas innecesarias a la base de datos
        const isCacheExist = await redis.get(courseId);

        if (isCacheExist) {
            try {
                const course = JSON.parse(isCacheExist);
                return res.status(200).json({
                    success: true,
                    message: "Curso cargado desde la memoria del caché (Se evitó una consulta a la base de datos innecesaria)",
                    cached: true, // Indica que la respuesta proviene de la caché
                    course,
                });
            } catch (error) {
                console.error("Error al parsear datos de Redis:", error);
            }
        }

        // Si no está en caché, busca el curso en la base de datos y excluye datos sensibles
        const course = await CourseModel.findById(courseId).select(
            '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links'
        );

        // Si el curso no se encuentra, responder sin guardar en caché
        if (!course) {
            return res.status(404).json({
                message: 'Curso no encontrado',
                success: false,
            });
        }

        // Almacena en caché la respuesta con un tiempo de expiración de 1 hora (3600 segundos)
        await redis.setex(courseId, 3600, JSON.stringify(course));

        res.status(200).json({
            message: 'Curso obtenido exitosamente',
            success: true,
            cached: false, // Indica que la respuesta proviene de la base de datos
            course,
        });

    } catch (error: any) {
        console.error("Error en getSingleCourse:", error);
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores
    }
});

// Obtener todos los cursos sin necesidad de haberlos comprado
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Verifica si los cursos están en caché
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

        // Si no están en caché, obtener de la base de datos
        const courses = await CourseModel.find().select(
            '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links'
        );

        // Si no hay cursos en la base de datos, responder sin caché
        if (!courses.length) {
            return res.status(404).json({
                message: 'No hay cursos disponibles',
                success: false,
            });
        }

        // Guardar en caché con expiración de 1 hora
        await redis.setex('allCourses', 3600, JSON.stringify(courses));

        return res.status(200).json({
            message: 'Cursos obtenidos exitosamente',
            success: true,
            cached: false,
            courses,
        });

    } catch (error: any) {
        console.error("Error en getAllCourses:", error);
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores
    }
});
export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses || [];
        const courseId = req.params.id;

        // Verifica si el usuario tiene acceso al curso
        const courseExists = userCourseList.find((course: any) => course._id.toString() === courseId);

        if (!courseExists) {
            return next(new ErrorHandler("No eres elegible para acceder a este curso", 403)); // Código 403 (Prohibido) es más adecuado
        }

        // Buscar curso en la base de datos
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
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores
    }
});

// Interfaz para definir la estructura de los datos que se reciben al agregar una pregunta
interface IAddQuestionData {
    question: string;  // Pregunta formulada por el usuario
    courseId: string;  // ID del curso donde se agregará la pregunta
    contentId: string; // ID del contenido específico dentro del curso
}

// Controlador para añadir una pregunta en un contenido de un curso
export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extrae los datos de la petición
        const { question, courseId, contentId }: IAddQuestionData = req.body;

        // Busca el curso en la base de datos
        const course = await CourseModel.findById(courseId);

        // Verifica si el `contentId` es un ID válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("El contenido no tiene un ID válido", 400)); // Error 400 (Bad Request)
        }

        // Busca el contenido dentro del curso usando el `contentId`
        const courseContent = ((course?.courseData as unknown) as any[])?.find((item: any) => item._id.equals(contentId));

        // Si el contenido no existe dentro del curso, devuelve un error
        if (!courseContent) {
            return next(new ErrorHandler("El curso no contiene este contenido", 404)); // Error 404 (Not Found)
        }

        // Crea un nuevo objeto de pregunta
        const newQuestion: any = {
            user: req.user,   // Asocia la pregunta al usuario que la hizo
            question,         // Pregunta que se está agregando
            questionReplices: [], // Inicializa un array vacío para las respuestas
        };

        // Agrega la nueva pregunta dentro del contenido del curso
        courseContent.questions.push(newQuestion);

        // Guarda los cambios en la base de datos
        await course?.save();

        // Responde con éxito y retorna el curso actualizado
        res.status(200).json({
            message: 'Pregunta añadida exitosamente',
            success: true,
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores en caso de falla
    }
});

// Interfaz para los datos requeridos al agregar una respuesta a una pregunta del curso
interface IAddAnswerData {
    answer: string,   // Respuesta proporcionada por el usuario
    courseId: string, // ID del curso donde se encuentra la pregunta
    contentId: string,// ID del contenido dentro del curso
    questionId: string,// ID de la pregunta a la que se responderá
}

// Controlador para añadir una respuesta a una pregunta dentro de un curso
export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extrae los datos de la solicitud
        const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;

        // Busca el curso en la base de datos usando su ID
        const course = await CourseModel.findById(courseId);

        // Verifica si el `contentId` es un ID válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("El contenido no tiene un ID válido", 400)); // Error 400 (Bad Request)
        };
        
        // Busca el contenido dentro del curso usando `contentId`
        const courseContent = ((course?.courseData as unknown) as any[])?.find((item: any) => item._id.equals(contentId));

        // Si el contenido no existe dentro del curso, devuelve un error
        if (!courseContent) {
            return next(new ErrorHandler("El curso no contiene este contenido", 404)); // Error 404 (Not Found)
        };

        // Busca la pregunta dentro del contenido usando `questionId`
        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

        // Si la pregunta no existe dentro del curso, devuelve un error
        if (!question) {
            return next(new ErrorHandler("El curso no contiene esta pregunta", 404)); // Error 404 (Not Found)
        };

        // Crea un nuevo objeto de respuesta
        const newAnswer: any = {
            user: req.user, // Usuario que responde la pregunta
            answer,         // Contenido de la respuesta
        };

        // Agrega la nueva respuesta a la lista de respuestas de la pregunta
        question.questionReplices.push(newAnswer);

        // Guarda el curso actualizado en la base de datos
        await course?.save();
        
        // Verifica si el usuario que responde es el mismo que hizo la pregunta
        if (req.user?.id === question.user._id) {
            // Si el usuario responde su propia pregunta, no es necesario enviar una notificación
            // Aquí podrías agregar lógica para notificaciones internas si es necesario
        } else {
            // Si la respuesta es de otro usuario, se enviará una notificación al creador de la pregunta
            
            // Datos para la plantilla de correo electrónico
            const data = {
                name: question.user.name, // Nombre del usuario que hizo la pregunta
                title: courseContent.title, // Título del contenido donde está la pregunta
            };

            // Renderiza el contenido del correo usando una plantilla EJS
            const html = await ejs.renderFile(path.join(__dirname, '../mails/question-reply.ejs'), data);

            try {
                // Envía el correo de notificación al usuario que hizo la pregunta
                await sendEmail({
                    email: question.user.email,
                    subject: 'Se ha añadido respuesta a tu pregunta en uno de nuestros cursos',
                    template: 'question-reply.ejs',
                    data,
                });

            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500)); // Manejo de errores en el envío del correo
            }

            // Respuesta exitosa con mensaje de notificación enviada
            res.status(200).json({
                message: 'Respuesta añadida exitosamente, se ha enviado un mensaje de notificación',
                success: true,
                course,
            });
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores generales
    }
});

// Interfaz para la estructura de datos de una reseña
interface IAddReviewData {
    review: string,    // Texto de la reseña
    courseId: string,  // ID del curso al que se añade la reseña
    rating: number,    // Calificación otorgada (ejemplo: de 1 a 5 estrellas)
    userId: string,    // ID del usuario que deja la reseña
}

// Controlador para agregar una reseña a un curso
export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses; // Lista de cursos en los que el usuario está inscrito
        const courseId = req.params.id; // ID del curso extraído de los parámetros de la URL

        // Verifica si el usuario tiene acceso al curso revisando su lista de cursos
        const courseExists = userCourseList?.some((course: any) => course._id.toString() === courseId.toString());
        
        if (!courseExists) {
            return next(new ErrorHandler("Usted no tiene acceso válido a este curso", 404)); 
        };

        // Busca el curso en la base de datos
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Curso no encontrado", 404));
        }

        // Extrae la reseña y calificación del cuerpo de la solicitud
        const { review, rating } = req.body as IAddReviewData;

        // Crea la estructura de datos para la nueva reseña
        const reviewData: any = {
            user: req.user,  // Usuario que realiza la reseña
            rating,          // Calificación dada al curso
            comment: review, // Texto de la reseña
        };

        // Agrega la reseña al array de reseñas del curso
        course.reviews.push(reviewData);

        // Calcula el nuevo promedio de calificaciones
        let avg = 0;
        course.reviews.forEach((rev: any) => {
            avg += rev.rating;
        });

        // Actualiza el campo `ratings` del curso con el nuevo promedio
        if (course.reviews.length > 0) {
            course.ratings = avg / course.reviews.length; 
            // Ejemplo: si hay dos reseñas con calificaciones de 5 y 4, la media será (5 + 4) / 2 = 4.5  
        };

        // Guarda los cambios en la base de datos
        await course.save();

        // Crea una notificación (puedes implementarla si es necesario)
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
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores generales
    }
});

// Interfaz para los datos de la respuesta a una reseña
interface IAddReviewData {
    comment: string,  // Comentario que se agregará como respuesta
    courseId: string, // ID del curso donde está la reseña
    reviewId: string, // ID de la reseña a la que se responderá
}

export const addReplayToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extraer los datos de la solicitud
        const { comment, courseId, reviewId } = req.body as IAddReviewData;

        // Buscar el curso en la base de datos por su ID
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Curso no encontrado", 404)); // Retorna error si el curso no existe
        };

        // Buscar la reseña dentro del curso usando su ID
        const review = course.reviews?.find((rev: any) => rev._id.toString() === reviewId);

        if (!review) {
            return next(new ErrorHandler("Reseña no encontrada", 404)); // Retorna error si la reseña no existe
        };

        // Crear el objeto de respuesta (comentario dentro de la reseña)
        const replyData: any = {
            user: req.user, // Usuario autenticado que está respondiendo
            comment, // Contenido de la respuesta
        };
        
        if (!review.commentReplices) {
            review.commentReplices = [];
        }

        // ERROR: Se está agregando la respuesta a la lista de reseñas del curso en lugar de a la reseña específica
        review.commentReplices?.push(replyData);

        // Guardar los cambios en la base de datos
        await course.save();

        res.status(200).json({
            message: 'Comentario añadido exitosamente',
            success: true,
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores generales
    }
});
