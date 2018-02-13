import * as sql from 'mssql';
import { IncidentService } from '../../domain/services/incident_services';
import { SecurityService } from '../../domain/services/security_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;
    const incident_service = new IncidentService(pool);

    
    app.post("/api/incident/close", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {
        let result = await incident_service.close_incident(request.body.incident);

        response.send({ sucess: true});
    });

    app.post("/api/incident/start", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {
        let result = await incident_service.start_incident(request.body.incident);

        response.send({ sucess: true});
    });

    app.post("/api/incident/reopen", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {
        let result = await incident_service.reopen_incident(request.body.incident);

        response.send({ sucess: true});
    });

    app.post("/api/incident/start/cancel", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {
        let result = await incident_service.cancel_start_incident(request.body.incident);

        response.send({ sucess: true});
    });

    app.post("/api/incident/remove", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {            
        let result = await incident_service.remove_incident(request.body.incident);            
                    
        response.send({ sucess: true});
    });

    app.post("/api/incident/reschedule", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {            
        let result = await incident_service.reschedule_incident(
            request.body.incident, 
            request.body.new_incident,
            request.body.contact.contact_text
        );            

        response.send({ sucess: true}); 
    });

    app.post("/api/incident/register_incident", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {              
        let result = await incident_service.register_incident(
            request.body.incident
        );            

        response.send({ sucess: true});
    });

    app.post("/api/incident/register_contact", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {            
        let result = await incident_service.register_contact_for_incident(
            request.body.incident, 
            request.body.contact.contact_text
        );            

        response.send({ sucess: true});                        
    });

    /**
     * COMMENTS    
     */

    app.get("/api/incident_comments/incident/:id/:show_archived?", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => {  
        try {                      
            const result = await new sql.Request(pool)
            .input('incident_id', sql.Int, request.params.id)
            .input('show_archived', sql.Int, request.params.show_archived || 0)
            .execute(`GetIncidentComments`);                
            
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);   
                     
        } catch(error)  {   
            console.log(error);
            res.status(500).json(error);
        }
    });

    app.post("/api/incident_comments", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => { 
        let result = await incident_service.save_comment(
            request.body.incident_id,
            request.body.comment
        );            

        res.send(result.recordset[0][0]);        
    });

    app.post("/api/incident_comments/archive", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => { 
        let result = await incident_service.archive_comment(
            request.body.id
        );            

        res.send(result.recordset[0][0]); 
    });
}