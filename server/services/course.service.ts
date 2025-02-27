import { Response } from 'express';
import CourseModel from '../models/course.model';
import { CatchAsyncError } from '../middleware/catchAsyncError';

// Función para crear un curso (maneja errores de forma asíncrona)
export const createCourse = CatchAsyncError(async (
    data: any, // Datos del curso recibidos
    res: Response
) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        message: 'Curso creado exitosamente',
        success: true,
        course,
    });
});
