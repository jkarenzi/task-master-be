export {}
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swaggerconfig');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

module.exports = app;