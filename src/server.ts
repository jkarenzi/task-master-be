import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swaggerconfig';
dotenv.config();

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
  .catch((err) => {
    console.log(err);
  });

app.use('/api', routes);

export default app;