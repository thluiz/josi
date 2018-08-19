import * as auth from "../middlewares/auth";
import { InvitationsService } from "../services/invitations-service";

export function routes(app) {
    app.post("/api/invitations/change_type",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const indicationId = req.body.id;
        const newType = req.body.type;

        const result = await InvitationsService.change_invite_type(indicationId, newType);

        res.send(result);
    });
}
