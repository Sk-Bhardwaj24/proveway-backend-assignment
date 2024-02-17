import { NextFunction, Response } from 'express';
import { responseCode, responseMessage } from '../config/constant';
import { refreshAccessToken } from '../config/google.drive';
import { updateUser } from '../controllers/auth/auth.service';
import { responseMethod } from '../helpers/common.helper';
import { IGetUserAuthInfoRequest } from '../helpers/interface.helper';

const googleAuthorization = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user?.email as unknown as boolean) {
    if (isAccessTokenExpired(req.user?.accessTokenExpiration as number)) {
      const token = await refreshAccessToken(req.user?.refreshToken as string);
      await updateUser(
        { _id: req.user?._id },
        {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessTokenExpiration: token.accessTokenExpiration
        }
      );
    } else {
      console.log('Access token is still valid');
    }
    next();
  } else {
    responseMethod(req, res, {}, responseCode.UNAUTHORIZED, false, responseMessage.TOKEN_EXPIRED);
  }
};
export default googleAuthorization;

function isAccessTokenExpired(expirationTime: number): boolean {
  // Get the current time in milliseconds
  const currentTime = new Date().getTime();

  // Compare the expiration time with the current time
  return expirationTime <= currentTime;
}
