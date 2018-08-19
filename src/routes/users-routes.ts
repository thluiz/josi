import { SuccessResult } from "../helpers/result";
import { SecurityService } from "../services/security-service";

export function routes(app) {
    app.get("/api/users/current",
    async (req, res) => {
        try {
            const userReq = await new SecurityService().getUserFromRequest(req);
            const user = await (new SecurityService()).serializeUser(userReq);
            res.send(SuccessResult.GeneralOk(user));
        } catch (error) {
            res.status(500).json({ error });
        }
    });
}
