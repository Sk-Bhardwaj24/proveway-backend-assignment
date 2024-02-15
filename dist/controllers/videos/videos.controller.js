"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const common_helper_1 = require("../../helpers/common.helper");
const constant_1 = require("../../config/constant");
const google_drive_1 = require("../../config/google.drive");
const videos_service_1 = require("./videos.service");
exports.default = {
    downloadVideo: async (req, res) => {
        const directory = path_1.default.join(__dirname, '../../../downloadedFiles/');
        (0, common_helper_1.ensureDirectoryExists)(directory);
        try {
            let fileId = '';
            const match = req?.body?.sourceFile.match(/\/file\/d\/([^/?#]+)(?:\/|\?|#|$)/i);
            if (match && match[1]) {
                fileId = match[1];
            }
            else {
                console.log('Invalid file ID');
                throw new Error('Invalid file');
            }
            console.log(fileId);
            const drive = await (0, google_drive_1.getDriveInstance)();
            const response = await drive.files.get({
                fileId,
                fields: 'size, name'
            });
            const filePath = path_1.default.join(directory, response?.data?.name);
            const [err, downloadingResult] = await (0, videos_service_1.downloadDriveVideos)(filePath, fileId, response.data.size);
            if (err) {
                console.log(err);
                throw err;
            }
            const [error] = await (0, videos_service_1.uploadVideoChunked)(filePath, response.data.name);
            if (error) {
                console.log(error);
                throw error;
            }
            (0, common_helper_1.responseMethod)(req, res, 
            // {},
            downloadingResult, constant_1.responseCode.OK, true, constant_1.responseMessage.DOWNLOADING_SUCCESSFULL);
        }
        catch (error) {
            console.error('Error downloading file:', error);
            (0, common_helper_1.responseMethod)(req, res, error, constant_1.responseCode.INTERNAL_SERVER_ERROR, false, constant_1.responseMessage.INTERNAL_SERVER_ERROR);
        }
    },
    getDownloadProgress: async (req, res) => {
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
        const sendEvent = (progress) => {
            res.write(`data: ${progress}\n\n`);
        };
        videos_service_1.downloadProgressEmitter.on('downlaodProgress', (progress) => {
            sendEvent(progress);
        });
        // End the response stream when the progress is complete
        videos_service_1.downloadProgressEmitter?.once('downLoadComplete', () => {
            console.log('Download complete');
            res.end();
        });
    },
    getUploadProgress: async (req, res) => {
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
        const sendEvent = (progress) => {
            res.write(`data: ${progress}\n\n`);
        };
        // Listener for custom events
        videos_service_1.uploadProgressEmitter.on('progress', (progress) => {
            sendEvent(progress);
        });
        // End the response stream when the progress is complete
        videos_service_1.uploadProgressEmitter?.once('complete', () => {
            console.log('Upload complete');
            res.end();
        });
    }
};
