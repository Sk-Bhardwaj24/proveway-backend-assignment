import { responseCode, responseMessage } from '../../config/constant';
import { createJwtToken, responseMethod } from '../../helpers/common.helper';
import { Request, Response } from 'express';
import { findUser, registerUser, updateUser } from './auth.service';
import { IGetUserAuthInfoRequest } from '../../helpers/interface.helper';
import { oauth2Client } from '../../config/google.drive';
import fs from 'fs';
import jwt from 'jsonwebtoken';

export default {
  /**
   * A description of the entire function.
   *
   * @param {IGetUserAuthInfoRequest} req - description of parameter
   * @param {Response} res - description of parameter
   * @return {Promise<void>} description of return value
   */
  getProfile: async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.email as unknown as boolean) {
        responseMethod(
          req,
          res,
          req.user,

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
  },

  login: async (req: Request, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
      // eslint-disable-next-line camelcase
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/drive'
      ]
    });
    console.log('url==============>', url);
    res.redirect(url);
  },
  googleRedirect: async (req: Request, res: Response) => {
    console.log(req.query.code);
    try {
      // let tokenFile: any = fs.readFileSync('tokens.json');
      // tokenFile = JSON.parse(tokenFile ?? {});
      // let tokens;
      // if (!(tokenFile.id_token as boolean)) {
      const { code } = req.query;
      console.log(code);
      const { tokens } = await oauth2Client.getToken(code as string);
      fs.writeFileSync('tokens.json', JSON.stringify(tokens));
      // }
      // tokens = tokenFile;
      oauth2Client.setCredentials(tokens);
      const decodedIdToken: any = jwt.decode(tokens.id_token as string);
      const accessToken = tokens.access_token as string;
      const refreshToken = tokens.refresh_token as string;
      const accessTokenExpiration = tokens.expiry_date as number;
      const email = decodedIdToken?.email as string;
      const user = await findUser({ email }, { email: 1 });
      const userData = {
        firstName: decodedIdToken?.given_name,
        lastName: decodedIdToken?.family_name,
        email: decodedIdToken?.email,
        profilePicture: decodedIdToken?.picture,
        accessToken,
        refreshToken
      };
      if (!(user?.email as boolean)) {
        await registerUser(userData);
      } else {
        await updateUser({ _id: user?._id }, { accessToken, refreshToken, accessTokenExpiration });
      }
      const tokenPayload = {
        email,
        firstName: decodedIdToken?.given_name,
        _id: user?._id
      };
      const token = createJwtToken(tokenPayload);
      res.redirect(
        `${
          process.env.CLIENT_URL as string
        }/redirect/?accessToken=${accessToken}&token=${token}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      console.log(error);
    }
  },
  logout: async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      console.log('req.user', req.user);
      // await oauth2Client.revokeToken(req.user?.refreshToken as string);
      await oauth2Client.revokeToken(req.user?.accessToken as string);
      await updateUser(
        { _id: req.user?._id },
        { accessToken: null, refreshToken: '', accessTokenExpiration: '' }
      );
      return responseMethod(
        req,
        res,
        {},
        responseCode.OK,
        true,
        responseMessage.LOGOUT_SUCCESSFULL
      );
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
