import * as sql from 'mssql';
import { IncidentService } from '../../domain/services/incident_services';
import * as auth from '../../src/middlewares/auth';
import { SecurityService } from '../../src/services/security-service';
import { Result } from '../../src/helpers/result';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;
    const incident_service = new IncidentService(pool);
        
    /**
     * COMMENTS    
     */

    app.get("/api/incident_comments/incident/:id/:show_archived?", 
    auth.ensureLoggedIn(),
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
    auth.ensureLoggedIn(),
    async (request, res, next) => { 
        let user = await SecurityService.getUserFromRequest(request);
        console.log(user);

        let result = await incident_service.save_comment(
            request.body.incident_id,
            request.body.comment,
            await user.getPersonId()    
        );            

        res.send(Result.Ok("INCIDENT_COMMENT_ADDED",  [ result.recordset[0][0] ] ));        
    });

    app.post("/api/incident_comments/archive", 
    auth.ensureLoggedIn(),
    async (request, res, next) => { 
        let result = await incident_service.archive_comment(
            request.body.id
        );            

        res.send(Result.Ok("INCIDENT_COMMENT_ARCHIVED", [ result.recordset[0][0]])); 
    });
}