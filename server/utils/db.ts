import mongoose from "mongoose";
require("dotenv").config();

const dbUrl: string = process.env.DB_URL || "";

const connectDB = async () => {
    if (!dbUrl) {
        console.error("❌ Error: La URL de la base de datos (DB_URL) no está definida.");
        process.exit(1); 
    }

    try {
        const connection = await mongoose.connect(dbUrl);
        console.log(`✅ Conexión exitosa a MongoDB: ${connection.connection.host}`);
    } catch (error: any) {
        console.error(`❌ Error al conectar a MongoDB: ${error.message}`);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;

