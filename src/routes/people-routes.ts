import * as auth from '../middlewares/auth';
import * as multer from 'multer';
import { MulterAzureStorage } from 'multer-azure-blob-storage';

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

const PS = new PeopleService();
const PR = PeopleRepository;

export function routes(app) {
    app.post("/api/people/avatar_image",
    auth.ensureLoggedIn(),
    upload.any(),
    async (req, res) => {
        let result = await PS.save_avatar_image(req.body.id, req.files[0].blobName);

        res.send(result);
    });

    app.get("/api/external_contacts",
    auth.ensureLoggedIn(),
    async (req, res) => {
        let result = await PR.getExternalContacts(
            req.query.branch > 0 ? req.query.branch : null,
            req.query.voucher > 0 ? req.query.voucher : null,
            req.query.name,
            req.query.voucher_status > 0 ? req.query.voucher_status : null,
            req.query.people_per_page > 0 ? req.query.people_per_page : null,
            req.query.page > 1 ? req.query.page : 1
        );

        res.send(result);
    });


    app.post("/api/people_comments/pin",
        auth.ensureLoggedIn(),
        async (request, response) => {
            let result = await PS.pin_comment(
                request.body.id
            );

            response.send(result);
        });
}
