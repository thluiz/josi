import { IncidentsRepository } from './../repository/incidents-repository';

import * as auth from '../../src/middlewares/auth';
import { InvitationsService } from '../services/invitations-service';
import { DatabaseFacility } from '../facilities/database-facility';
import { SecurityService } from '../services/security-service';
import { IncidentsService } from '../services/incidents-service';

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

    app.get("/api/incidents/:id",
    auth.ensureLoggedIn(),
    async (request, response, next) => {          
        let result = await IR.getIncidentDetails( request.params.id );
        
        response.send(result);
    });

    app.get("/api/agenda/:branch?/:date?",
    auth.ensureLoggedIn(),
    async (req, res, next) => {        
        let result = await IR.getAgenda( 
            req.params.branch > 0 ? req.params.branch : null,  
            req.params.date
        );
    
        res.send(result);        
    });

    app.post("/api/incident/close", 
    auth.ensureLoggedIn(),
    async (req, response, next) => {
        let user = await SecurityService.getUserFromRequest(req);
        let result = await IncidentsService.close_incident({ 
            id: req.body.id, 
            close_text: req.body.close_text 
        }, await user.getPersonId());

        response.send(result); 
    });

    app.post("/api/incident/start", 
    auth.ensureLoggedIn(),
    async (req, response, next) => {
        let user = await SecurityService.getUserFromRequest(req);
        let result = await IncidentsService.start_incident({ id: req.body.id }, await user.getPersonId());

        response.send(result); 
    });

    app.post("/api/incident/reopen", 
    auth.ensureLoggedIn(),
    async (req, response, next) => {
        let user = await SecurityService.getUserFromRequest(req);
        let result = await IncidentsService.reopen_incident({ id: req.body.id }, await user.getPersonId());

        response.send(result); 
    });

    app.post("/api/incident/start/cancel", 
    auth.ensureLoggedIn(),
    async (req, response, next) => {
        let user = await SecurityService.getUserFromRequest(req);
        let result = await IncidentsService.cancel_start_incident({ id: req.body.id }, await user.getPersonId());

        response.send(result); 
    }); 
 
    app.post("/api/incident/remove", 
    auth.ensureLoggedIn(),
    async (request, response, next) => {        
        let user = await SecurityService.getUserFromRequest(request);          
        let result = await IncidentsService.remove_incident({ id: request.body.id },
            await user.getPersonId());            
                    
        response.send(result); 
    });

    app.post("/api/incident/reschedule", 
    auth.ensureLoggedIn(),
    async (request, response, next) => {            
        let user = await SecurityService.getUserFromRequest(request);          

        let result = await IncidentsService.reschedule_incident(
            request.body.incident, 
            request.body.new_incident,
            request.body.contact.contact_text,
            await user.getPersonId()
        );            

        response.send(result); 
    });

    app.post("/api/incident/register_incident", 
    auth.ensureLoggedIn(),
    async (request, response, next) => {              
        let user = await SecurityService.getUserFromRequest(request);          
        let result = await IncidentsService.register_incident(
            request.body.incident,
            await user.getPersonId()
        );            

        response.send(result); 
    });

    app.post("/api/incident/register_contact", 
    auth.ensureLoggedIn(),
    async (request, response, next) => {
        let user = await SecurityService.getUserFromRequest(request);          

        let result = await IncidentsService.register_contact_for_incident(
            request.body.incident, 
            request.body.contact.contact_text,
            await user.getPersonId()
        );            

        response.send(result); 
    });
}
