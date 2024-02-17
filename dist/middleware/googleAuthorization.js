"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../config/constant");
const google_drive_1 = require("../config/google.drive");
const auth_service_1 = require("../controllers/auth/auth.service");
const common_helper_1 = require("../helpers/common.helper");
const googleAuthorization = async (req, res, next) => {
    if (req.user?.email) {
        if (isAccessTokenExpired(req.user?.accessTokenExpiration)) {
            const token = await (0, google_drive_1.refreshAccessToken)(req.user?.refreshToken);
            await (0, auth_service_1.updateUser)({ _id: req.user?._id }, {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                accessTokenExpiration: token.accessTokenExpiration
            });
        }
        else {
            console.log('Access token is still valid');
        }
        next();
    }
    else {
        (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.UNAUTHORIZED, false, constant_1.responseMessage.TOKEN_EXPIRED);
    }
};
exports.default = googleAuthorization;
function isAccessTokenExpired(expirationTime) {
    // Get the current time in milliseconds
    const currentTime = new Date().getTime();
    // Compare the expiration time with the current time
    return expirationTime <= currentTime;
}
