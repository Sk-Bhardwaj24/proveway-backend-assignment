"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.createJwtToken = exports.ensureDirectoryExists = exports.responseMethod = void 0;
const constant_1 = require("../config/constant");
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseMethod = (req, res, data, code = constant_1.responseCode.OK, success = true, message = '') => {
    res.status(code).send({
        code,
        message,
        success,
        data
    });
};
exports.responseMethod = responseMethod;
function ensureDirectoryExists(directory) {
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory, { recursive: true });
    }
}
exports.ensureDirectoryExists = ensureDirectoryExists;
const createJwtToken = (body, expiresIn) => {
    return jsonwebtoken_1.default.sign(body, process.env.JWT_SECRET ?? '', {
        expiresIn: expiresIn ?? process.env.LOGIN_TOKEN_EXPIRE_TIME
    });
};
exports.createJwtToken = createJwtToken;
const verifyJwtToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET ?? '');
};
exports.verifyJwtToken = verifyJwtToken;
