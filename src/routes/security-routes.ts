const AzureSessionStore = require('../middlewares/azure-session-storage');

export function routes(app) {
    app.get("/api/security/sessions/cleanup", async (req, res, next) => {                
        let session_storage = new AzureSessionStore();
        let promise = (session_storage.cleanup() as Promise<boolean>);        

        promise.then(() => {
            res.send({ success: true });
        }).catch((err) => {
            res.send({ success: false, error: err });
        });        
    });
}