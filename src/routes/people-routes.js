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
const auth = require("../middlewares/auth");
const multer = require("multer");
const multer_azure_blob_storage_1 = require("multer-azure-blob-storage");
const people_service_1 = require("../services/people-service");
const people_repository_1 = require("../repositories/people-repository");
const azureStorage = new multer_azure_blob_storage_1.MulterAzureStorage({
    connectionString: process.env.AZURE_AVATAR_STORAGE,
    containerName: 'avatars',
    containerAccessLevel: 'blob',
    urlExpirationTime: 60
});
const upload = multer({
    storage: azureStorage
});
const PS = new people_service_1.PeopleService();
const PR = people_repository_1.PeopleRepository;
function routes(app) {
    app.post("/api/people/avatar_image", auth.ensureLoggedIn(), upload.any(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let result = yield PS.save_avatar_image(req.body.id, req.files[0].blobName);
        res.send(result);
    }));
    app.get("/api/external_contacts", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let result = yield PR.getExternalContacts(req.query.branch > 0 ? req.query.branch : null, req.query.voucher > 0 ? req.query.voucher : null, req.query.name, req.query.voucher_status > 0 ? req.query.voucher_status : null, req.query.people_per_page > 0 ? req.query.people_per_page : null, req.query.page > 1 ? req.query.page : 1);
        res.send(result);
    }));
    app.post("/api/people_comments/pin", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        let result = yield PS.pin_comment(request.body.id);
        response.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=people-routes.js.map