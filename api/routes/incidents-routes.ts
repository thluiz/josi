import * as sql from 'mssql';
import { IncidentService } from '../../domain/services/incident_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;
    const incident_service = new IncidentService(pool);

    
    app.post("/api/incident/close", async (request, response, next) => {
        let result = await incident_service.close_incident(request.body.incident);

        response.send("Ok");
    });

    app.post("/api/incident/start", async (request, response, next) => {
        let result = await incident_service.start_incident(request.body.incident);

        response.send("Ok");
    });

    app.post("/api/incident/start/cancel", async (request, response, next) => {
        let result = await incident_service.cancel_start_incident(request.body.incident);

        response.send("Ok");
    });

    app.post("/api/incident/remove", async (request, response, next) => {            
        let result = await incident_service.remove_incident(request.body.incident);            
                    
        response.send("Ok");
    });

    app.post("/api/incident/reschedule", async (request, response, next) => {            
        let result = await incident_service.reschedule_incident(
            request.body.incident, 
            request.body.new_incident,
            request.body.contact.contact_text
        );            

        response.send("Ok"); 
    });

    app.post("/api/incident/register_incident", async (request, response, next) => {      
        console.log(request.body.incident);
        let result = await incident_service.register_incident(
            request.body.incident
        );            

        response.send("Ok");
    });

    app.post("/api/incident/register_contact", async (request, response, next) => {            
        let result = await incident_service.register_contact_for_incident(
            request.body.incident, 
            request.body.contact.contact_text
        );            

        response.send("Ok");                        
    });
}