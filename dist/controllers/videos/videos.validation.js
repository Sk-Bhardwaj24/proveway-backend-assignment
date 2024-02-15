"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadVideoValidation = void 0;
const express_validation_1 = require("express-validation");
exports.downloadVideoValidation = {
    body: express_validation_1.Joi.object({
        sourceFile: express_validation_1.Joi.string().required()
    })
};
