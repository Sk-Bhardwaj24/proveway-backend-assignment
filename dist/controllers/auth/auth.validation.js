"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleSignin = void 0;
const express_validation_1 = require("express-validation");
exports.googleSignin = {
    body: express_validation_1.Joi.object({
        token: express_validation_1.Joi.string().required()
    })
};
