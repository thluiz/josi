"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth = require("../../src/middlewares/auth");
const multer = require("multer");
const multer_azure_blob_storage_1 = require("multer-azure-blob-storage");
const people_service_1 = require("../services/people-service");
const azureStorage = new multer_azure_blob_storage_1.MulterAzureStorage({
    connectionString: process.env.AZURE_AVATAR_STORAGE,
    containerName: 'avatars',
    containerAccessLevel: 'blob',
    urlExpirationTime: 60
});
const upload = multer({
    storage: azureStorage
});
function routes(app) {
    app.post("/api/people/avatar_image", auth.ensureLoggedIn(), upload.any(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield people_service_1.PeopleService.save_avatar_image(req.body.id, req.files[0].blobName);
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=people-routes.js.map