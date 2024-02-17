import express from 'express';
import VideosController from './videos.controller';
import { validate } from 'express-validation';
import * as videosValidation from './videos.validation';
import { authenticate } from '../../middleware/authenticate';
import googleAuthorization from '../../middleware/googleAuthorization';

export const videosRouter = express.Router();

videosRouter.post(
  '/download',
  authenticate,
  googleAuthorization,
  validate(videosValidation.downloadVideoValidation, {}, {}),
  VideosController.downloadVideo
);

videosRouter.get('/download-progress', VideosController.getDownloadProgress);
videosRouter.get('/upload-progress', VideosController.getUploadProgress);
