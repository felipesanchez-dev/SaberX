import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Representa un comentario con respuestas opcionales.
 */
interface IComment extends Document {
    user: object;
    comment: string;
    commentReplices?: IComment[];
}

/**
 * Representa una reseña con calificación y comentarios.
 */
interface IReview extends Document {
    user: string;
    rating: number;
    comment: string;
    commentReplices: IComment[];
}

/**
 * Representa un enlace con título y URL.
 */
interface ILink extends Document {
    title: string;
    url: string;
}

/**
 * Representa los datos de un curso, incluyendo videos, preguntas y sugerencias.
 */
interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    VideoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

/**
 * Representa un curso con su información principal.
 */
interface ICourse extends Document {
    name: string;
    description: string;
    price?: number; // Precio del curso (opcional)
    estimatedPrice?: number;  // Precio estimado (en caso de descuentos o variaciones)
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData;
    ratings?: number;
    purchased: number;
}

// Esquema para las reseñas del curso
const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: { type: Number, default: 0 },
    comment: String,
});

// Esquema para los enlaces del curso
const linkSchema = new Schema<ILink>({
    title: String,
    url: String,
});

// Esquema para los comentarios y sus respuestas
const commentSchema = new Schema<IComment>({
    user: Object,
    comment: String,
    commentReplices: [Object],
});

// Esquema para los datos del curso
const courseDataSchema = new Schema<ICourseData>({
    videoUrl: String,
    // videoThumbnail: Object,
    title: String,
    VideoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
});

// Esquema para la información principal del curso
const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true, // Nombre del curso (obligatorio)
    },
    description: {
        type: String,
        required: true, // Descripción del curso (obligatorio)
    },
    price: {
        type: Number,
        required: false, // Precio del curso (opcional, por defecto gratuito)
    },
    estimatedPrice: {
        type: Number,
        required: false, // Precio estimado en caso de descuentos
    },
    thumbnail: {
        public_id: {
            type: String,
            // required: true, // ID de la imagen en el servidor
        },
        url: {
            type: String,
            // required: true, // URL de la imagen del curso
        },
    },
    tags: {
        type: String,
        required: true, // Etiquetas relacionadas con el curso
    },
    level: {
        type: String,
        required: true, // Nivel del curso (principiante, intermedio, avanzado)
    },
    demoUrl: {
        type: String,
        required: true, // URL de demostración del curso
    },
    benefits: [{ title: String }], // Beneficios que ofrece el curso
    prerequisites: [{ title: String }], // Requisitos previos para tomar el curso
    reviews: [reviewSchema], // Reseñas de los usuarios
    courseData: [courseDataSchema], // Datos del curso (secciones, videos, preguntas)
    ratings: { 
        type: Number,
        default: 0, // Puntuación promedio del curso (inicialmente 0)
    },
    purchased: {
        type: Number,
        default: 0, // Número de veces comprado
    },
});

// Modelo de Mongoose para la colección de cursos
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;