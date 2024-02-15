"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.getDriveInstance = void 0;
// eslint-disable-next-line camelcase
const googleapis_1 = require("googleapis");
const credentials_json_1 = __importDefault(require("./credentials.json"));
// eslint-disable-next-line camelcase
const getDriveInstance = async () => {
    const auth = await (0, exports.authorize)();
    return googleapis_1.google.drive({ version: 'v3', auth });
};
exports.getDriveInstance = getDriveInstance;
const authorize = async () => {
    const SCOPE = ['https://www.googleapis.com/auth/drive'];
    const jwtClient = new googleapis_1.google.auth.JWT(credentials_json_1.default.client_email, undefined, credentials_json_1.default.private_key, SCOPE);
    await jwtClient.authorize();
    return jwtClient;
};
exports.authorize = authorize;
