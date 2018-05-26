import * as auth from '../../src/middlewares/auth';
import * as multer from 'multer';
import { MulterAzureStorage, MASNameResolver, MASObjectResolver } from 'multer-azure-blob-storage';

import { PeopleService } from '../services/people-service';

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
}
