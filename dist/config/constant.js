"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessage = exports.responseCode = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.responseCode = {
    OK: 200,
    NO_CONTENT: 204,
    CREATED: 201,
    ACCEPTED: 202,
    RESET_CONTENT: 205,
    NON_AUTHORITATIVE_INFORMATION: 203,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    IM_USED: 226,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    NOT_EXTENDED: 510,
    SERVICE_UNAVAILABLE: 503,
    HTTP_VERSION_NOT_SUPPORTED: 505
};
exports.responseMessage = {
    INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again!',
    DOWNLOADING_SUCCESSFULL: 'Downloading successfull',
    SIGN_IN_SUCCESSFULL: 'You are successfully signed in.',
    TOKEN_EXPIRED: 'Token has been expired',
    VERIFY_TOKEN_SUCCESSFULL: 'Token verified successfully',
    VERIFY_TOKEB_UNSUCCESSFULL: 'Token verification failed',
    TOKEN_MISSING: 'Token missing',
    USER_NOT_FOUND: 'User not found'
};
