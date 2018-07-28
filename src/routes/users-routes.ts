import { SecurityService } from "../services/security-service";

export function routes(app) {
    app.get("/api/users/current", async (req, res, next) => {
        try {
            const userReq = await SecurityService.getUserFromRequest(req);
            const user = await SecurityService.serializeUser(userReq);

            res.send(user);
        } catch (error) {
            res.status(500).json({ error });
        }
    });
}