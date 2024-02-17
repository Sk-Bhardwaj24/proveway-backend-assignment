import { Response, Request } from 'express';
import { responseCode } from '../config/constant';
import fs from 'fs';
import { otpTokenPayload } from './interface.helper';
import jwt from 'jsonwebtoken';
export const responseMethod = (
  req: Request,
  res: Response,
  data: unknown,
  code = responseCode.OK,
  success = true,
  message = ''
): void => {
  res.status(code).send({
    code,
    message,
    success,
    data
  });
};

export const sendEventData = (
  res: Response,
  dataObject: { progress?: number; message?: string; type: string },
  end = false
): void => {
  res.write(`data: ${JSON.stringify(dataObject)}\n\n`);
  if (end) {
    res.end();
  }
};
export function ensureDirectoryExists(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export const createJwtToken = (body: otpTokenPayload, expiresIn?: any): string => {
  return jwt.sign(body, process.env.JWT_SECRET ?? '', {
    expiresIn: expiresIn ?? process.env.LOGIN_TOKEN_EXPIRE_TIME
  });
};

export const verifyJwtToken = (token: string): otpTokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET ?? '') as otpTokenPayload;
};
