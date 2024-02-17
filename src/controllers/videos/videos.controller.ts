import { Request, Response } from 'express';
import path from 'path';
import { ensureDirectoryExists, responseMethod, sendEventData } from '../../helpers/common.helper';
import { responseCode, responseMessage } from '../../config/constant';
import { oauth2Client } from '../../config/google.drive';
import {
  downloadDriveVideos,
  uploadVideoChunked,
  uploadProgressEmitter,
  downloadProgressEmitter
} from './videos.service';
import { google } from 'googleapis';

export default {
  /**
   * Download a video file from a source and upload it to a destination.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {void} no return value
   */
  downloadVideo: async (req: Request, res: Response): Promise<any> => {
    const directory = path.join(__dirname, '../../../downloadedFiles/');
    ensureDirectoryExists(directory);
    try {
      let fileId = '';
      const match = req?.body?.sourceFile.match(/\/file\/d\/([^/?#]+)(?:\/|\?|#|$)/i);

      if ((match as boolean) && (match[1] as boolean)) {
        fileId = match[1];
      } else {
        console.log('Invalid file ID');
        throw new Error('Invalid file');
      }

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      let response;

      try {
        response = await drive.files.get({
          fileId,
          fields: 'size, name'
        });
      } catch (error: any) {
        return responseMethod(
          req,
          res,
          {},
          responseCode.OK,
          false,
          error?.errors[0]?.message ?? error
        );
      }

      if (response?.data?.name as unknown as boolean) {
        responseMethod(
          req,
          res,
          { message: 'Downloading started' },
          responseCode.OK,
          true,
          responseMessage.DOWNLOADING_IN_PROGRESS
        );
      } else {
        responseMethod(
          req,
          res,
          {},
          responseCode.OK,
          true,
          responseMessage.DOWNLOADING_UNSUCCESSFULL
        );
      }

      const filePath = path.join(directory, response?.data?.name as string);

      const [err] = await downloadDriveVideos(
        filePath,
        fileId,
        response.data.size as unknown as number
      );

      if (err as boolean) {
        downloadProgressEmitter.emit('downloadingError', err);
        throw err;
      }

      const [error] = await uploadVideoChunked(filePath, response.data.name as string);
      if (error as boolean) {
        uploadProgressEmitter.emit('uploadingError', err);
        console.log(error);
        throw error;
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

  /**
   * A function to get the download progress.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {void}
   */
  getDownloadProgress: async (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    downloadProgressEmitter.on('downlaodProgress', (progress) => {
      sendEventData(res, {
        progress,
        type: 'downloading'
      });
    });

    downloadProgressEmitter.once('downloadingError', (err) => {
      console.log('Error downloading file:', err);
      sendEventData(
        res,
        {
          message: err,
          type: 'error'
        },
        true
      );
    });
    // End the response stream when the progress is complete
    downloadProgressEmitter?.once('downLoadComplete', () => {
      console.log('Download complete');
      sendEventData(
        res,
        {
          type: 'complete',
          message: 'Download complete'
        },
        true
      );
    });
  },

  /**
   * A function to get the upload progress and set CORS headers.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {void}
   */
  getUploadProgress: async (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    // Listener for custom events
    uploadProgressEmitter.on('progress', (progress) => {
      sendEventData(res, { progress, type: 'uploading' });
    });

    // End the response stream when the progress is complete
    uploadProgressEmitter?.once('complete', () => {
      sendEventData(res, { type: 'complete', message: 'Upload complete' }, true);
    });

    uploadProgressEmitter?.once('uploadingError', (error) => {
      sendEventData(res, { message: error, type: 'error' }, true);
    });
  }
};
