const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app')


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
  .catch((err:Error) => {
    console.log(err);
  });