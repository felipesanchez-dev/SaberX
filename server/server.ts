import { app } from './app';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from './utils/db';
require('dotenv').config();

// Configuración de Cloudinary con manejo de errores
try {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  console.log("Cloudinary configurado correctamente ✅");
} catch (error) {
  console.error("Error configurando Cloudinary ❌", error);
  process.exit(1); // Detiene la ejecución si falla Cloudinary
}

// Conexión a la base de datos con manejo de errores
connectDB().catch((error) => {
  console.error("Error conectando a la base de datos ❌", error);
  process.exit(1); // Detiene la ejecución si falla la conexión a la base de datos
});

// Inicia el servidor en el puerto definido en .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto: ${PORT}`);
}).on('error', (error) => {
  console.error("Error iniciando el servidor ❌", error);
  process.exit(1); // Detiene la ejecución si hay un error en el servidor
});

