const express = require("express");
const { dbConnection } = require("./database/config");
require("dotenv").config();
const cors = require("cors");

// creamos el servidor de express
const app = express();

// conexion a base de datos
dbConnection();

// configuramos el cors
app.use(cors());

// directorio publico
app.use(express.static("public"));

// lectura y parseo del body
app.use(express.json());

// rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

// escuchamos las peticiones
app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
});
