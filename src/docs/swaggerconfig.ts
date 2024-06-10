const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskMaster API',
      version: '1.0.0',
      description: 'Documentation for task master api',
    },
    servers: [
      {
        url: process.env.APP_URL,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerformat: 'JWT',
        },
      },
    },
  },
  apis: ['src/docs/*'],
};

module.exports = swaggerJsdoc(options);
