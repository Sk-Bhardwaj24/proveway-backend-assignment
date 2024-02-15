import { config } from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
config();

export const loginGoogle = async (token: string): Promise<void> => {
  try {
    const client = new OAuth2Client(process.env.CLIENT_ID ?? '');
    const ticket: any = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID ?? ''
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (err: any) {
    console.log('error in loginGoogle: ', err);
  }
};
