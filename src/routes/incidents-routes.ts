import { IncidentsRepository } from './../repository/incidents-repository';

import * as auth from '../../src/middlewares/auth';
import { InvitationsService } from '../services/invitations-service';
import { DatabaseFacility } from '../facilities/database-facility';

const IR = IncidentsRepository;

export function routes(app) {
    app.get("/api/incidents/history/:person/:activity_type/:page?",
    auth.ensureLoggedIn(),
    async (request, response, next) => {          
        let result = await IR.getPersonIncidentsHistory( request.params.person,
            request.params.activity_type, 
            request.params.page > 0 ? request.params.page : 1)
        
        response.send(result);
    });
}
