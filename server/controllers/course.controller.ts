import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary'
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';

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

// Controlador para obtener un solo curso por su ID
export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Busca el curso por ID y excluye datos sensibles o no necesarios
        const course = await CourseModel.findById(req.params.id).select(
            '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links'
        );

        res.status(200).json({
            message: 'Curso obtenido exitosamente',
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores
    }
});

// Obtener todos los cursos sin necesidad de haberlos comprado
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Busca todos los cursos y excluye información sensible o accesible solo para usuarios comprados
        const courses = await CourseModel.find().select(
            '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links'
        );

        res.status(200).json({
            message: 'Cursos obtenidos exitosamente',
            success: true,
            courses,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)); // Manejo de errores con mensaje adecuado
    }
});
