import fs from 'fs';
import axios from 'axios';
import { authorize, getDriveInstance } from '../../config/google.drive';
import EventEmitter from 'events';

const uploadProgressEmitter = new EventEmitter();
const downloadProgressEmitter = new EventEmitter();

/**
 * Downloads videos from Google Drive to a specified file path, with progress tracking.
 *
 * @param {string} filePath - the file path to save the downloaded video
 * @param {string} fileId - the ID of the video file on Google Drive
 * @param {number} size - the size of the video file in bytes
 * @return {Promise<any>} - a Promise that resolves with an array containing an error (if any) and the download result
 */
export async function downloadDriveVideos(
  filePath: string,
  fileId: string,
  size: number
): Promise<any> {
  const dest = fs.createWriteStream(filePath);
  try {
    const drive = await getDriveInstance();

    const result: any = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    let bytesRead = 0;
    let initialPercenatge = 0;

    result.data.on('data', (chunk) => {
      bytesRead += chunk.length as number;

      const progress = (bytesRead / size) * 100;
      const processedPercenatge = +progress;

      if (processedPercenatge - initialPercenatge >= 1) {
        downloadProgressEmitter.emit('downlaodProgress', progress);
        initialPercenatge = processedPercenatge;
      }

      if (progress === 100) {
        downloadProgressEmitter.emit('downlaodProgress', progress);
        downloadProgressEmitter.emit('downLoadComplete');
      }
    });
    const downloadingResult = await new Promise((resolve, reject) => {
      result.data
        .on('end', () => {
          console.log('File downloaded successfully');
          resolve('downloaded');
        })

        .on('error', (err: any) => {
          console.error('Error downloading file:', err);
          reject(err);
        })

        .pipe(dest);
    });

    return [null, downloadingResult];
  } catch (error) {
    console.error('Error downloading file:', error);
    return [error];
  } finally {
    dest.close();
  }
}
/**
 * Uploads a video file in chunks to Google Drive.
 *
 * @param {string} filePath - The path of the file to be uploaded.
 * @param {string} fileName - The name of the file.
 * @return {Promise<any>} A promise that resolves with the result of the upload.
 */
export async function uploadVideoChunked(filePath: string, fileName: string): Promise<any> {
  try {
    const auth = await authorize();
    const accessToken = (await auth.getAccessToken()).token as string;

    const name = fileName;
    const mimeType = 'video/mp4';
    const parents = ['1sk2RwEzmU1-feA35dhn38bVJlJG9RW2j8RAUOeVreYlfmlleQrrrzCyjzQNLIPvEFznXuBtL'];

    const chunkSize = 5 * 1024 * 1024; // This is a sample chunk size.
    const fileSize: number = fs.statSync(filePath).size;

    const initialResponse = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ name, mimeType, parents })
    });

    const { location } = initialResponse.headers;
    let startByte = 0;
    const endByte = fileSize - 1;

    while (startByte < endByte) {
      const currentEndByte = Math.min(startByte + chunkSize - 1, endByte);

      const chunkUploadingResponse = await axios({
        method: 'PUT',
        url: location,
        headers: { 'Content-Range': `bytes ${startByte}-${currentEndByte}/${fileSize}` },
        data: fs.createReadStream(filePath, { start: startByte, end: currentEndByte })
      }).catch(({ response }) => console.log({ status: response.status, message: response.data }));

      startByte = currentEndByte + 1;

      if (chunkUploadingResponse?.data as boolean) {
        console.log(chunkUploadingResponse?.data);
        const progress = (startByte / fileSize) * 100;
        uploadProgressEmitter.emit('progress', progress);
        if (progress === 100) uploadProgressEmitter.emit('complete');
      }
    }

    fs.unlink(filePath, (fileerr) => {
      if (fileerr as unknown as boolean) {
        console.error('Error deleting file:', fileerr);
        return;
      }
      console.log('File deleted successfully');
    });

    return [null, 'data uploaded successfully'];
  } catch (error) {
    console.log(error);
    return [error];
  }
}

export { uploadProgressEmitter };
export { downloadProgressEmitter };
