"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../config/constant");
const google_drive_1 = require("../../config/google.drive");
const common_helper_1 = require("../../helpers/common.helper");
exports.default = {
    test: async (req, res) => {
        let code = '4/0AeaYSHAgIfUhsAPk90kYhFr9eNwN5x7gQTfmhlRunEvkabfzHI2Q-5lYxdUhsp-zRDDROQ';
        const tokens = await google_drive_1.oauth2Client.getToken(code);
        console.log('==================>', tokens);
        return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.OK, true, constant_1.responseMessage.LOGOUT_SUCCESSFULL);
    }
};
