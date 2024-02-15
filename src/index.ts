import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';
import { ValidationError } from 'express-validation';
import { config } from 'dotenv';
import { joiErrorFormator } from './helpers/validation.helper';
import cors from 'cors';
import { apiRoutes } from './routes/api.routes';
import { connectMongodb } from './config/database';

config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;

connectMongodb();
app.listen(PORT, () => {
  console.log('App is listening At', PORT);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', apiRoutes);
app.use((err: ValidationError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    const error = joiErrorFormator(req, res, err);
    return res.status(err.statusCode).json(error);
  } else {
    return res.status(500).json(err);
  }
});

export default app;
