
import * as auth from '../../src/middlewares/auth';
import { InvitationsService } from '../services/invitations-service';

export function routes(app) {
    app.post("/api/invitations/change_type",
    auth.ensureLoggedIn(),
    async (req, res, next) => {          
        const indication_id = req.body.id;
        const new_type = req.body.type;

        let result = await InvitationsService.change_invite_type(indication_id, new_type);

        res.send(result);
    });
}
