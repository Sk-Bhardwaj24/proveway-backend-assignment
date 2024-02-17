"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const database_1 = require("../config/database");
const users = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    accessToken: {
        type: String,
        required: false
    },
    refreshToken: {
        type: String,
        required: false
    },
    accessTokenExpiration: {
        type: Date,
        required: false
    }
}, {
    autoIndex: true
});
exports.Users = database_1.provewayDatabaseConnection.model('users', users);
