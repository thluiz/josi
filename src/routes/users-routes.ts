import { LoggerService } from './../services/logger-service';
import { SecurityService } from "../services/security-service";

export function routes(app) {
    app.get("/api/users/current", async (req, res, next) => {
        try {
            LoggerService.log('/api/users/current - request', req);
            const userReq = await SecurityService.getUserFromRequest(req);
            const user = await SecurityService.serializeUser(userReq);   

            res.send(user);    
        } catch (error) {            
            res.status(500).json({ error });
        }        
    });
}