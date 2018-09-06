import * as auth from "../middlewares/auth";
import { IncidentsService } from "../services/incidents-service";

export function routes(app) {
    const IS = new IncidentsService();

    app.post("/api/ownerships/migrate",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const result = await IS.migrateOwnership(req.body.ownership, req.body.incidents);

        response.send(result);
    });
}