import { responseCode, responseMessage } from '../../config/constant';
import { oauth2Client } from '../../config/google.drive';
import { responseMethod } from '../../helpers/common.helper';
import { Request, Response } from 'express';
export default {
  test: async (req: Request, res: Response) => {
    let code = '4/0AeaYSHAgIfUhsAPk90kYhFr9eNwN5x7gQTfmhlRunEvkabfzHI2Q-5lYxdUhsp-zRDDROQ';
    const tokens = await oauth2Client.getToken(code);
    console.log('==================>', tokens);
    return responseMethod(req, res, {}, responseCode.OK, true, responseMessage.LOGOUT_SUCCESSFULL);
  }
};
