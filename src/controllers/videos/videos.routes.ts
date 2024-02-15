import express from 'express';
import VideosController from './videos.controller';
import { validate } from 'express-validation';
import * as videosValidation from './videos.validation';

export const videosRouter = express.Router();

videosRouter.post(
  '/download',
  validate(videosValidation.downloadVideoValidation, {}, {}),
  VideosController.downloadVideo
);

videosRouter.get('/download-progress', VideosController.getDownloadProgress);
videosRouter.get('/upload-progress', VideosController.getUploadProgress);
