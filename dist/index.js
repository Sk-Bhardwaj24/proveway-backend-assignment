"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger/swagger.json"));
const express_validation_1 = require("express-validation");
const dotenv_1 = require("dotenv");
const validation_helper_1 = require("./helpers/validation.helper");
const cors_1 = __importDefault(require("cors"));
const api_routes_1 = require("./routes/api.routes");
const database_1 = require("./config/database");
const fs_1 = __importDefault(require("fs"));
const google_drive_1 = require("./config/google.drive");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT;
(0, database_1.connectMongodb)();
app.listen(PORT, () => {
    console.log('App is listening At', PORT);
});
try {
    const tokenFile = fs_1.default.readFileSync('tokens.json');
    google_drive_1.oauth2Client.setCredentials(JSON.parse(tokenFile));
}
catch (error) {
    console.log('no tokenfile found');
}
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use('/api', api_routes_1.apiRoutes);
app.use((err, req, res, next) => {
    if (err instanceof express_validation_1.ValidationError) {
        const error = (0, validation_helper_1.joiErrorFormator)(req, res, err);
        return res.status(err.statusCode).json(error);
    }
    else {
        return res.status(500).json(err);
    }
});
exports.default = app;
