const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const routes = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swaggerconfig');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const url = process.env.MONGO_URL as string;
const dbName = process.env.DB_NAME;
const port = process.env.PORT;

mongoose
  .connect(url, { dbName })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.log(err);
  });

app.use('/api', routes);

module.exports = app;
