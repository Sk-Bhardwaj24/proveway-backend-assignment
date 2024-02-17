"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const try_1 = __importDefault(require("./try"));
const authenticate_1 = require("../../middleware/authenticate");
exports.authRouter = express_1.default.Router();
exports.authRouter.get('/login', auth_controller_1.default.login);
exports.authRouter.get('/redirect', auth_controller_1.default.googleRedirect);
exports.authRouter.get('/get-profile', authenticate_1.authenticate, auth_controller_1.default.getProfile);
exports.authRouter.get('/logout', authenticate_1.authenticate, auth_controller_1.default.logout);
exports.authRouter.get('/test', try_1.default.test);
