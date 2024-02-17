"use strict";
/* eslint-disable camelcase */
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.oauth2Client = void 0;
const googleapis_1 = require("googleapis");
exports.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
async function refreshAccessToken(refreshToken) {
    exports.oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await exports.oauth2Client.refreshAccessToken();
    exports.oauth2Client.setCredentials(credentials);
    const tokens = {
        accessToken: credentials.access_token,
        refreshToken: credentials.refresh_token,
        accessTokenExpiration: credentials.expiry_date
    };
    return tokens;
}
exports.refreshAccessToken = refreshAccessToken;
