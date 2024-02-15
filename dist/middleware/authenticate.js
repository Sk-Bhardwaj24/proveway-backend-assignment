"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateMiddleware = exports.authenticate = void 0;
const common_helper_1 = require("../helpers/common.helper");
const constant_1 = require("../config/constant");
const auth_service_1 = require("../controllers/auth/auth.service");
const chalk_1 = __importDefault(require("chalk"));
const authenticate = async (req, res, next) => {
    try {
        const token = req?.headers?.token;
        if (token) {
            const validToken = (0, common_helper_1.verifyJwtToken)(token);
            if (validToken?.email !== undefined) {
                const user = await (0, auth_service_1.findUser)({ email: validToken.email?.trim() });
                req.user = JSON.parse(JSON.stringify(user));
                if (!req.user._id) {
                    return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.UNAUTHORIZED, false, constant_1.responseMessage.TOKEN_EXPIRED);
                }
                return next();
            }
            else {
                return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.UNAUTHORIZED, false, constant_1.responseMessage.TOKEN_EXPIRED);
            }
        }
        else {
            return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.UNAUTHORIZED, false, constant_1.responseMessage.TOKEN_MISSING);
        }
    }
    catch (error) {
        console.log(chalk_1.default.red('Error in middleware method: Middleware ', error));
        return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.INTERNAL_SERVER_ERROR, false, constant_1.responseMessage.INTERNAL_SERVER_ERROR);
    }
};
exports.authenticate = authenticate;
const authenticateMiddleware = (req, res, next) => {
    void (0, exports.authenticate)(req, res, next);
};
exports.authenticateMiddleware = authenticateMiddleware;
