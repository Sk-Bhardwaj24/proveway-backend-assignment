"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../config/constant");
const common_helper_1 = require("../../helpers/common.helper");
const auth_service_1 = require("./auth.service");
const google_drive_1 = require("../../config/google.drive");
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = {
    /**
     * A description of the entire function.
     *
     * @param {IGetUserAuthInfoRequest} req - description of parameter
     * @param {Response} res - description of parameter
     * @return {Promise<void>} description of return value
     */
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
    },
    login: async (req, res) => {
        const url = google_drive_1.oauth2Client.generateAuthUrl({
            // eslint-disable-next-line camelcase
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/drive'
            ]
        });
        console.log('url==============>', url);
        res.redirect(url);
    },
    googleRedirect: async (req, res) => {
        console.log(req.query.code);
        try {
            // let tokenFile: any = fs.readFileSync('tokens.json');
            // tokenFile = JSON.parse(tokenFile ?? {});
            // let tokens;
            // if (!(tokenFile.id_token as boolean)) {
            const { code } = req.query;
            console.log(code);
            const { tokens } = await google_drive_1.oauth2Client.getToken(code);
            fs_1.default.writeFileSync('tokens.json', JSON.stringify(tokens));
            // }
            // tokens = tokenFile;
            google_drive_1.oauth2Client.setCredentials(tokens);
            const decodedIdToken = jsonwebtoken_1.default.decode(tokens.id_token);
            const accessToken = tokens.access_token;
            const refreshToken = tokens.refresh_token;
            const email = decodedIdToken?.email;
            const user = await (0, auth_service_1.findUser)({ email }, { email: 1 });
            const userData = {
                firstName: decodedIdToken?.given_name,
                lastName: decodedIdToken?.family_name,
                email: decodedIdToken?.email,
                profilePicture: decodedIdToken?.picture,
                accessToken,
                refreshToken
            };
            if (!user?.email) {
                await (0, auth_service_1.registerUser)(userData);
            }
            else {
                await (0, auth_service_1.updateUser)({ _id: user?._id }, { $set: { accessToken, refreshToken } });
            }
            const tokenPayload = {
                email,
                firstName: decodedIdToken?.given_name,
                _id: user?._id
            };
            const token = (0, common_helper_1.createJwtToken)(tokenPayload);
            res.redirect(`${process.env.CLIENT_URL}/redirect/?accessToken=${accessToken}&token=${token}&refreshToken=${refreshToken}`);
        }
        catch (error) {
            console.log(error);
        }
    },
    logout: async (req, res) => {
        try {
            console.log('req.user', req.user);
            // await oauth2Client.revokeToken(req.user?.refreshToken as string);
            await google_drive_1.oauth2Client.revokeToken(req.user?.accessToken);
            await (0, auth_service_1.updateUser)({ _id: req.user?._id }, { accessToken: null, refreshToken: '', accessTokenExpiration: '' });
            return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.OK, true, constant_1.responseMessage.LOGOUT_SUCCESSFULL);
        }
        catch (error) {
            console.log(error);
            return (0, common_helper_1.responseMethod)(req, res, {}, constant_1.responseCode.INTERNAL_SERVER_ERROR, false, constant_1.responseMessage.INTERNAL_SERVER_ERROR);
        }
    }
};
