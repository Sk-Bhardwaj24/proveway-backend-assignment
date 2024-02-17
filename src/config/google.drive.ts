/* eslint-disable camelcase */

import { google } from 'googleapis';

interface GetRefreshAccessToken {
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  accessTokenExpiration: number | null | undefined;
}

export const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export async function refreshAccessToken(refreshToken: any): Promise<GetRefreshAccessToken> {
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(credentials);
  const tokens = {
    accessToken: credentials.access_token,
    refreshToken: credentials.refresh_token,
    accessTokenExpiration: credentials.expiry_date
  };
  return tokens;
}
