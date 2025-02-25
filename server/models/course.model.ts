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
    videoThumbnail: Object,
    title: String,
    VideoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
});
