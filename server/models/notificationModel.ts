import mongoose, { Document, Model, Schema } from 'mongoose';

// Interfaz que define la estructura de una notificación
export interface INotification extends Document {
    title: string;   // Título de la notificación
    message: string; // Contenido del mensaje
    status: string;  // Estado de la notificación (ej. "unread", "read")
    userId: string;  // ID del usuario al que está dirigida la notificación
}

// Esquema de la notificación en la base de datos
const notificationSchema = new Schema<INotification>({
    title: {
        type: String,
        required: true, // El título es obligatorio
    },
    message: {
        type: String,
        required: true, // El mensaje es obligatorio
    },
    status: {
        type: String,
        required: true,
        default: 'unread', // Por defecto, la notificación está sin leer
    }, 
}, { timestamps: true }); // Agrega automáticamente createdAt y updatedAt

// Modelo de Mongoose para la colección "Notification"
const NotificationModel: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default NotificationModel;
