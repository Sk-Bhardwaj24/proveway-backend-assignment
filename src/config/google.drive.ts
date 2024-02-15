// eslint-disable-next-line camelcase
import { google, Auth, drive_v3 } from 'googleapis';
import credentials from './credentials.json';

export type DriveInstance = ReturnType<typeof getDriveInstance>;

// eslint-disable-next-line camelcase
export const getDriveInstance = async (): Promise<drive_v3.Drive> => {
  const auth = await authorize();
  return google.drive({ version: 'v3', auth });
};

export const authorize = async (): Promise<Auth.JWT> => {
  const SCOPE = ['https://www.googleapis.com/auth/drive'];
  const jwtClient = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
};
