"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginGoogle = void 0;
const dotenv_1 = require("dotenv");
const google_auth_library_1 = require("google-auth-library");
(0, dotenv_1.config)();
const loginGoogle = async (token) => {
    try {
        const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID ?? '');
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID ?? ''
        });
        const payload = ticket.getPayload();
        return payload;
    }
    catch (err) {
        console.log('error in loginGoogle: ', err);
    }
};
exports.loginGoogle = loginGoogle;
