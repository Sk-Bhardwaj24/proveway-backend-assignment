import { responseCode, responseMessage } from '../../config/constant';
import { createJwtToken, responseMethod } from '../../helpers/common.helper';
import { loginGoogle } from '../../helpers/googleOauth.helper';
import { Request, Response } from 'express';
import { findUser, registerUser } from './auth.service';
import { IGetUserAuthInfoRequest } from '../../helpers/interface.helper';
export default {
  googleLogin: async (req: Request, res: Response) => {
    try {
      const payload: any = await loginGoogle(req.body.token);

      if (payload as boolean) {
        const userData = {
          firstName: payload?.given_name,
          lastName: payload?.family_name,
          email: payload?.email,
          profilePicture: payload?.picture
        };
        const query = {
          email: userData?.email
        };
        const field = {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          profilePicture: 1,
          isProfileCompleated: 1
        };
        let user = await findUser(query, field);
        if (!(user?.email as boolean)) {
          // do nothing here
          user = await registerUser(userData);
        }
        const { email, firstName, _id } = user;
        const tokenPayload = {
          email,
          firstName,
          _id
        };

        const token = createJwtToken(tokenPayload);
        responseMethod(
          req,
          res,
          {
            user,
            token
          },
          responseCode.OK,
          true,
          responseMessage.SIGN_IN_SUCCESSFULL
        );
      } else {
        responseMethod(
          req,
          res,
          {},
          responseCode.BAD_REQUEST,
          false,
          responseMessage.TOKEN_EXPIRED
        );
      }
    } catch (error) {
      console.log(error);
      return responseMethod(
        req,
        res,
        {},
        responseCode.INTERNAL_SERVER_ERROR,
        false,
        responseMessage.INTERNAL_SERVER_ERROR
      );
    }
  },
  getProfile: async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      if (req.user?.email as unknown as boolean) {
        responseMethod(
          req,
          res,
          {
            data: req.user
          },
          responseCode.OK,
          true,
          responseMessage.VERIFY_TOKEN_SUCCESSFULL
        );
      } else {
        responseMethod(
          req,
          res,
          {},
          responseCode.BAD_REQUEST,
          false,
          responseMessage.VERIFY_TOKEB_UNSUCCESSFULL
        );
      }
    } catch (error) {
      console.log(error);
      return responseMethod(
        req,
        res,
        {},
        responseCode.INTERNAL_SERVER_ERROR,
        false,
        responseMessage.INTERNAL_SERVER_ERROR
      );
    }
  }
};
