const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "api",
            version: "1.0.0",
            description: "Rest API Documentation"
        },
        servers: [
            {
                url: process.env.API_BASE_URL || "http://localhost:3000",
            },
        ],
    },

    apis: [
        "./src/routes/*.js",
    ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;