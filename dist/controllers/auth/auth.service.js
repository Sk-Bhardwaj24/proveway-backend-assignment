"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.findUser = void 0;
const user_model_1 = require("../../models/user.model");
const findUser = async (query, field) => {
    return await user_model_1.Users.findOne(query, field);
};
exports.findUser = findUser;
const registerUser = async (data) => {
    return await user_model_1.Users.create(data);
};
exports.registerUser = registerUser;
