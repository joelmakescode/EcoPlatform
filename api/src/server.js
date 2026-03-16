const express = require('express');
const app = express();
const cors = require('cors');
const usersRoute = require('./routes/user_routes');
const stocksRoute = require('./routes/stocks_routes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'Economy API', version: '1.0.0', description: 'User & Stocks API' },
    servers: [{ url: `http://localhost:${process.env.PORT}` }],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/users', usersRoute);
app.use('/stocks', stocksRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server läuft auf Port ${process.env.PORT}`);
});