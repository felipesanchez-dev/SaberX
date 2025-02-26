import express from 'express';
import { editCourse, getAllCourses, getSingleCourse, uploadCourse, getCourseByUser, addQuestion, addAnswer, addReview, addReplayToReview } from '../controllers/course.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const courseRouter = express.Router();

// Ruta para crear un curso (solo accesible para administradores)
courseRouter.post(
    '/create-course', 
    isAuthenticated,  // Verifica si el usuario está autenticado
    authorizeRoles('admin'), // Solo administradores pueden crear cursos
    uploadCourse 
);

// Ruta para editar un curso por ID (solo accesible para administradores)
courseRouter.put(
    '/edit-course/:id', 
    isAuthenticated, 
    authorizeRoles('admin'), // Solo administradores pueden editar cursos
    editCourse 
);

// Ruta para obtener los datos de un curso por ID
courseRouter.get(
    '/get-course/:id',
    getSingleCourse // Controlador que obtiene un curso específico basado en su ID
);

// Ruta para obtener la lista de todos los cursos disponibles
courseRouter.get(
    '/get-courses',
    getAllCourses // Controlador que devuelve la lista de todos los cursos
);

// Ruta para obtener el contenido del curso por ID (solo accesible para usuarios autenticados)
courseRouter.get(
    '/get-course-content/:id',
    isAuthenticated,  
    getCourseByUser   // Controlador que obtiene el contenido del curso por ID
);

// Ruta para añadir una pregunta a un curso
courseRouter.put(
    '/add-question',
    isAuthenticated,  
    addQuestion       // Controlador que maneja la adición de preguntas a un curso
);

// Ruta para añadir una respuesta a una pregunta dentro de un curso
courseRouter.put(
    '/add-answer',
    isAuthenticated, 
    addAnswer        // Controlador que maneja la adición de respuestas
);

// Ruta para añadir una reseña a un curso
courseRouter.put(
    '/add-review/:id',
    isAuthenticated, 
    addReview        // Controlador que maneja la adición de reseñas
);

// Ruta para añadir una respuesta a una reseña dentro de un curso (solo accesible para administradores)
courseRouter.put(
    '/add-reply',   
    isAuthenticated,    
    authorizeRoles('admin'), // Solo administradores pueden responder reseñas
    addReplayToReview // Controlador que maneja la adición de respuestas a reseñas
);

export default courseRouter;
