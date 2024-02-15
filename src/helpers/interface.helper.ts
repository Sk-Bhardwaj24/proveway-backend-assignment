import { Request } from 'express';
export interface queryInterface {
  _id?: string;
  email?: string;
}
export interface otpTokenPayload {
  _id?: string;
  email?: string;
  firstName?: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: any;
}
