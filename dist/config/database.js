"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongodb = exports.provewayDatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.provewayDatabaseConnection = mongoose_1.default.createConnection(process.env.MONGO_URL ?? '');
const connectMongodb = () => {
    console.log('Database connection made successfully.');
    return {
        provewayDatabaseConnection: exports.provewayDatabaseConnection
    };
};
exports.connectMongodb = connectMongodb;
