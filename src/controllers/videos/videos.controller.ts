import { Request, Response } from 'express';
import path from 'path';
import { ensureDirectoryExists, responseMethod } from '../../helpers/common.helper';
import { responseCode, responseMessage } from '../../config/constant';
import { getDriveInstance } from '../../config/google.drive';
import {
  downloadDriveVideos,
  uploadVideoChunked,
  uploadProgressEmitter,
  downloadProgressEmitter
} from './videos.service';

export default {
  /**
   * Download a video file from a source and upload it to a destination.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {void} no return value
   */
  downloadVideo: async (req: Request, res: Response) => {
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
      console.log(fileId);
      const drive = await getDriveInstance();
      const response = await drive.files.get({
        fileId,
        fields: 'size, name'
      });
      const filePath = path.join(directory, response?.data?.name as string);

      const [err, downloadingResult] = await downloadDriveVideos(
        filePath,
        fileId,
        response.data.size as unknown as number
      );
      if (err as boolean) {
        console.log(err);
        throw err;
      }

      const [error] = await uploadVideoChunked(filePath, response.data.name as string);
      if (error as boolean) {
        console.log(error);
        throw error;
      }

      responseMethod(
        req,
        res,
        // {},
        downloadingResult,
        responseCode.OK,
        true,
        responseMessage.DOWNLOADING_SUCCESSFULL
      );
    } catch (error) {
      console.error('Error downloading file:', error);
      responseMethod(
        req,
        res,
        error,
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
    const allowedOrigin = req.headers.origin ?? '';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);

    // // Set other CORS headers as needed
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    const sendEvent = (progress: any): void => {
      res.write(`data: ${progress as number}\n\n`);
    };
    downloadProgressEmitter.on('downlaodProgress', (progress) => {
      sendEvent(progress);
    });

    // End the response stream when the progress is complete
    downloadProgressEmitter?.once('downLoadComplete', () => {
      console.log('Download complete');
      res.end();
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
    const allowedOrigin = req.headers.origin ?? '';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);

    // // Set other CORS headers as needed
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    const sendEvent = (progress: any): void => {
      res.write(`data: ${progress as number}\n\n`);
    };

    // Listener for custom events
    uploadProgressEmitter.on('progress', (progress) => {
      sendEvent(progress);
    });

    // End the response stream when the progress is complete
    uploadProgressEmitter?.once('complete', () => {
      console.log('Upload complete');
      res.end();
    });
  }
};
