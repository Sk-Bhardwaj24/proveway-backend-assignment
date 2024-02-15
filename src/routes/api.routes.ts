import express from 'express';
import { videosRouter } from '../controllers/videos/videos.routes';
import { authRouter } from '../controllers/auth/auth.routes';

export const apiRoutes = express.Router();
apiRoutes.use('/videos', videosRouter);
apiRoutes.use('/auth', authRouter);
