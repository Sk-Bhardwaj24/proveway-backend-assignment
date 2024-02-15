import express from 'express';
import { validate } from 'express-validation';
import * as authValidation from './auth.validation';
import authController from './auth.controller';
import { authenticate } from '../../middleware/authenticate';

export const authRouter = express.Router();
authRouter.post(
  '/google-login',
  validate(authValidation.googleSignin, {}, {}),
  authController.googleLogin
);
authRouter.get('/get-profile', authenticate, authController.getProfile);
