import { Joi } from 'express-validation';
export const downloadVideoValidation = {
  body: Joi.object({
    sourceFile: Joi.string().required()
  })
};
