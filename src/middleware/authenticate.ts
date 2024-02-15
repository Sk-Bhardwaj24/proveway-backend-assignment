import { Response, NextFunction } from 'express';
import { verifyJwtToken, responseMethod } from '../helpers/common.helper';
import { responseCode, responseMessage } from '../config/constant';
import { findUser } from '../controllers/auth/auth.service';
import { IGetUserAuthInfoRequest, otpTokenPayload } from '../helpers/interface.helper';
import chalk from 'chalk';
export const authenticate = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req?.headers?.token as string;
    if (token as unknown as boolean) {
      const validToken: otpTokenPayload = verifyJwtToken(token);
      if (validToken?.email !== undefined) {
        const user = await findUser({ email: validToken.email?.trim() });
        req.user = JSON.parse(JSON.stringify(user));
        if (!(req.user._id as boolean)) {
          return responseMethod(
            req,
            res,
            {},
            responseCode.UNAUTHORIZED,
            false,
            responseMessage.TOKEN_EXPIRED
          );
        }
        return next();
      } else {
        return responseMethod(
          req,
          res,
          {},
          responseCode.UNAUTHORIZED,
          false,
          responseMessage.TOKEN_EXPIRED
        );
      }
    } else {
      return responseMethod(
        req,
        res,
        {},
        responseCode.UNAUTHORIZED,
        false,
        responseMessage.TOKEN_MISSING
      );
    }
  } catch (error) {
    console.log(chalk.red('Error in middleware method: Middleware ', error));
    return responseMethod(
      req,
      res,
      {},
      responseCode.INTERNAL_SERVER_ERROR,
      false,
      responseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

export const authenticateMiddleware = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): void => {
  void authenticate(req, res, next);
};
