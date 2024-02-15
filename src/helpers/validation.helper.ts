/* eslint-disable indent */
import { Request, Response } from 'express';
import { responseMethod } from './common.helper';

export const joiErrorFormator = (req: Request, res: Response, err: any): void => {
  const status = err.statusCode;
  let message = '';
  if (err?.details?.body != null) {
    message = messageBuilder(err.details?.body[0]?.type, err.details?.body[0]?.context?.label);
  } else if (err.details.query != null) {
    message = messageBuilder(err.details.query[0].type, err.details?.query[0]?.context?.label);
  }
  return responseMethod(req, res, {}, status, false, message);
};

const messageBuilder = (type: string, path: string): string => {
  switch (type) {
    case 'any.required':
      return path + ' is required';
    case 'string.empty':
      return path + ' is not allowed to be empty';
    case 'string.pattern.base':
      return path + ' ' + 'should has valid pattern';
    case 'object.unknown':
      return path + ' parameter is not allowed';
    case 'any.only':
      return path + ' should has valid value';
    case 'boolean.base':
      return path + ' must be a boolean';
    case 'any.unknown':
      return path + ' parameter is not allowed';
    case 'array.base':
      return path + ' must be a array';
    case 'object.base':
      return path + 'must be a object';
    case 'string.email':
      return path + ' must be a valid emai';
    case 'string.base':
      return path + ' must be a string';
    case 'array.max':
      return path + ' ' + 'can not have more than max value';
    case 'number.base':
      return path + ' ' + 'must be a number';
    default:
      return type + ' need to add this type in joi messageBuilder';
  }
};
