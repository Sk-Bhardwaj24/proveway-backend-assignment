"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../config/constant");
const common_helper_1 = require("../../helpers/common.helper");
const googleOauth_helper_1 = require("../../helpers/googleOauth.helper");
const auth_service_1 = require("./auth.service");
exports.default = {
    googleLogin: async (req, res) => {
        try {
            const payload = await (0, googleOauth_helper_1.loginGoogle)(req.body.token);
            if (payload) {
                const userData = {
                    firstName: payload?.given_name,
                    lastName: payload?.family_name,
                    email: payload?.email,
                    profilePicture: payload?.picture
                };
                const query = {
                    email: userData?.email
                };
                const field = {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    profilePicture: 1,
                    isProfileCompleated: 1
                };
                let user = await (0, auth_service_1.findUser)(query, field);
                if (!user?.email) {
                    // do nothing here
                    user = await (0, auth_service_1.registerUser)(userData);
                }
                const { email, firstName, _id } = user;
                const tokenPayload = {
                    email,
                    firstName,
                    _id
                };
                const token = (0, common_helper_1.createJwtToken)(tokenPayload);
                (0, common_helper_1.responseMethod)(req, res, {
                    user,
                    token
                }, constant_1.responseCode.OK, true, constant_1.responseMessage.SIGN_IN_SUCCESSFULL);
            }
            else {
                (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.BAD_REQUEST, false, constant_1.responseMessage.TOKEN_EXPIRED);
            }
        }
        catch (error) {
            console.log(error);
            return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.INTERNAL_SERVER_ERROR, false, constant_1.responseMessage.INTERNAL_SERVER_ERROR);
        }
    },
    getProfile: async (req, res) => {
        try {
            if (req.user?.email) {
                (0, common_helper_1.responseMethod)(req, res, {
                    data: req.user
                }, constant_1.responseCode.OK, true, constant_1.responseMessage.VERIFY_TOKEN_SUCCESSFULL);
            }
            else {
                (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.BAD_REQUEST, false, constant_1.responseMessage.VERIFY_TOKEB_UNSUCCESSFULL);
            }
        }
        catch (error) {
            console.log(error);
            return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.INTERNAL_SERVER_ERROR, false, constant_1.responseMessage.INTERNAL_SERVER_ERROR);
        }
    }
};
