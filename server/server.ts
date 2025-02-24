import { app } from './app';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from './utils/db';
require('dotenv').config();

// Configuracion de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


// Inicia el servidor en el puerto definido en .env
app.listen(process.env.PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${process.env.PORT}`);
  connectDB();
});

