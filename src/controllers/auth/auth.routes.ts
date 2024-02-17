import express from 'express';
import authController from './auth.controller';
import testConteroller from './try';
import { authenticate } from '../../middleware/authenticate';

export const authRouter = express.Router();

authRouter.get('/login', authController.login);
authRouter.get('/redirect', authController.googleRedirect);
authRouter.get('/get-profile', authenticate, authController.getProfile);
authRouter.get('/logout', authenticate, authController.logout);

authRouter.get('/test', testConteroller.test);
