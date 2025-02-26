import mongoose, { Document, Model, Schema } from 'mongoose';

// Interfaz que define la estructura de una orden
export interface IOrder extends Document {
    courseId: string;  // ID del curso comprado
    userId: string;    // ID del usuario que realizó la compra
    payment_info: object; // Información del pago (puede contener detalles de la transacción)
}

// Esquema de la orden en la base de datos
const orderSchema = new Schema<IOrder>({
    courseId: {
        type: String,
        required: true, // El ID del curso es obligatorio
    },
    userId: {
        type: String,
        required: true, // El ID del usuario es obligatorio
    },
    payment_info: {
        type: Object, 
        // required: true, // (Opcional) Se podría requerir si la información de pago es obligatoria
    },

}, { timestamps: true }); // Agrega automáticamente createdAt y updatedAt

// Modelo de Mongoose para la colección "Order"
const OrderModel: Model<IOrder> = mongoose.model('Order', orderSchema);

export default OrderModel;
