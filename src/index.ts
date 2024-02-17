import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';
import { ValidationError } from 'express-validation';
import { config } from 'dotenv';
import { joiErrorFormator } from './helpers/validation.helper';
import cors from 'cors';
import { apiRoutes } from './routes/api.routes';
import { connectMongodb } from './config/database';
import fs from 'fs';
import { oauth2Client } from './config/google.drive';
config();
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://proveway-frontend-rho.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: '*'
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;

connectMongodb();
app.listen(PORT, () => {
  console.log('App is listening At', PORT);
});
try {
  const tokenFile = fs.readFileSync('tokens.json') as unknown as string;
  oauth2Client.setCredentials(JSON.parse(tokenFile));
} catch (error) {
  console.log('no tokenfile found');
}
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
