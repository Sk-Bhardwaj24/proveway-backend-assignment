import { Joi } from 'express-validation';

export const googleSignin = {
  body: Joi.object({
    token: Joi.string().required()
  })
};
