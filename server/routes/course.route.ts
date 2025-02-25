import express from 'express';
import { editCourse, uploadCourse } from '../controllers/course.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const courseRouter = express.Router();

// Ruta para crear un curso (solo accesible para administradores)
courseRouter.post(
    '/create-course', 
    isAuthenticated, // Verifica si el usuario está autenticado
    authorizeRoles('admin'), // Permite acceso solo a administradores
    uploadCourse // Controlador que maneja la creación del curso
);

courseRouter.put(
    '/edit-course/:id', 
    isAuthenticated, // Verifica si el usuario está autenticado
    authorizeRoles('admin'), // Permite acceso solo a administradores
    editCourse // Controlador que maneja la edicion de cursos
);


export default courseRouter;
