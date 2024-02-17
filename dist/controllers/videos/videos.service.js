"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadProgressEmitter = exports.uploadProgressEmitter = exports.uploadVideoChunked = exports.downloadDriveVideos = void 0;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const google_drive_1 = require("../../config/google.drive");
const events_1 = __importDefault(require("events"));
const googleapis_1 = require("googleapis");
const uploadProgressEmitter = new events_1.default();
exports.uploadProgressEmitter = uploadProgressEmitter;
const downloadProgressEmitter = new events_1.default();
exports.downloadProgressEmitter = downloadProgressEmitter;
/**
 * Downloads videos from Google Drive to a specified file path, with progress tracking.
 *
 * @param {string} filePath - the file path to save the downloaded video
 * @param {string} fileId - the ID of the video file on Google Drive
 * @param {number} size - the size of the video file in bytes
 * @return {Promise<any>} - a Promise that resolves with an array containing an error (if any) and the download result
 */
async function downloadDriveVideos(filePath, fileId, size) {
    const dest = fs_1.default.createWriteStream(filePath);
    try {
        const drive = googleapis_1.google.drive({ version: 'v3', auth: google_drive_1.oauth2Client });
        const result = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
        let bytesRead = 0;
        let initialPercenatge = 0;
        result.data.on('data', (chunk) => {
            bytesRead += chunk.length;
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
                .on('error', (err) => {
                console.error('Error downloading file:', err);
                reject(err);
            })
                .pipe(dest);
        });
        return [null, downloadingResult];
    }
    catch (error) {
        console.error('Error downloading file:', error);
        return [error];
    }
    finally {
        dest.close();
    }
}
exports.downloadDriveVideos = downloadDriveVideos;
/**
 * Uploads a video file in chunks to Google Drive.
 *
 * @param {string} filePath - The path of the file to be uploaded.
 * @param {string} fileName - The name of the file.
 * @return {Promise<any>} A promise that resolves with the result of the upload.
 */
async function uploadVideoChunked(filePath, fileName) {
    try {
        const name = fileName;
        const mimeType = 'video/mp4';
        // const parents = ['1sk2RwEzmU1-feA35dhn38bVJlJG9RW2j8RAUOeVreYlfmlleQrrrzCyjzQNLIPvEFznXuBtL'];
        const chunkSize = 5 * 1024 * 1024; // This is a sample chunk size.
        const fileSize = fs_1.default.statSync(filePath).size;
        const initialResponse = await (0, axios_1.default)({
            method: 'POST',
            url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
            headers: {
                Authorization: `Bearer ${(await google_drive_1.oauth2Client.getAccessToken()).token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ name, mimeType })
        });
        const { location } = initialResponse.headers;
        let startByte = 0;
        const endByte = fileSize - 1;
        while (startByte < endByte) {
            const currentEndByte = Math.min(startByte + chunkSize - 1, endByte);
            const chunkUploadingResponse = await (0, axios_1.default)({
                method: 'PUT',
                url: location,
                headers: { 'Content-Range': `bytes ${startByte}-${currentEndByte}/${fileSize}` },
                data: fs_1.default.createReadStream(filePath, { start: startByte, end: currentEndByte })
            }).catch(({ response }) => console.log({ status: response.status, message: response.data }));
            startByte = currentEndByte + 1;
            if (chunkUploadingResponse?.data) {
                console.log(chunkUploadingResponse?.data);
            }
            const progress = (startByte / fileSize) * 100;
            uploadProgressEmitter.emit('progress', progress);
            if (progress === 100)
                uploadProgressEmitter.emit('complete');
        }
        fs_1.default.unlink(filePath, (fileerr) => {
            if (fileerr) {
                console.error('Error deleting file:', fileerr);
                return;
            }
            console.log('File deleted successfully');
        });
        return [null, 'data uploaded successfully'];
    }
    catch (error) {
        console.log(error);
        return [error];
    }
}
exports.uploadVideoChunked = uploadVideoChunked;
