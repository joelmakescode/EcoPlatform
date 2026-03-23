const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");

const app = express();
app.use(express.json());

// API ROUTEN
app.use("/api", routes);

// SWAGGERUI ROUTEN
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = app;