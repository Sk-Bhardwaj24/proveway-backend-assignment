"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const videos_routes_1 = require("../controllers/videos/videos.routes");
const auth_routes_1 = require("../controllers/auth/auth.routes");
exports.apiRoutes = express_1.default.Router();
exports.apiRoutes.use('/videos', videos_routes_1.videosRouter);
exports.apiRoutes.use('/auth', auth_routes_1.authRouter);
