import * as auth from '../../src/middlewares/auth';
import * as multer from 'multer';
import { MulterAzureStorage, MASNameResolver, MASObjectResolver } from 'multer-azure-blob-storage';

import { PeopleService } from '../services/people-service';
import { PeopleRepository } from '../repositories/people-repository';

const azureStorage: MulterAzureStorage = new MulterAzureStorage({
    connectionString: process.env.AZURE_AVATAR_STORAGE,
    containerName: 'avatars',
    containerAccessLevel: 'blob',
    urlExpirationTime: 60
});

const upload: multer.Instance = multer({
    storage: azureStorage
});

export function routes(app) {
    app.post("/api/people/avatar_image",
    auth.ensureLoggedIn(),
    upload.any(),
    async (req, res, next) => {
        let result = await PeopleService.save_avatar_image(req.body.id, req.files[0].blobName);

        res.send(result);
    });

    app.get("/api/external_contacts",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
        let result = await PeopleRepository.getExternalContacts(
            req.query.branch > 0 ? req.query.branch : null,
            req.query.voucher > 0 ? req.query.voucher : null,
            req.query.name,
            req.query.voucher_status > 0 ? req.query.voucher_status : null,
            req.query.people_per_page > 0 ? req.query.people_per_page : null,
            req.query.page > 1 ? req.query.page : 1
        );

        res.send(result);
    });
}
