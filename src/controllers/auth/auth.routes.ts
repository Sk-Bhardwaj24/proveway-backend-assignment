import express from 'express';
import authController from './auth.controller';
import { authenticate } from '../../middleware/authenticate';

export const authRouter = express.Router();

authRouter.get('/login', authController.login);
authRouter.get('/google/redirect', authController.googleRedirect);
authRouter.get('/get-profile', authenticate, authController.getProfile);
authRouter.get('/logout', authenticate, authController.logout);
