import { app } from "./app";
require("dotenv").config();

// Inicia el servidor en el puerto definido en .env
app.listen(process.env.PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${process.env.PORT}`);
});
