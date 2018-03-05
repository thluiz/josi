import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    app.get("/api/branches", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetBranches`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/domains", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetDomains`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/programs", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetPrograms`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/kf_families", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetKungFuFamilies`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/recurrence_types", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetRecurrenceTypes`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/incident_types", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetIncidentTypes`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/contact_types", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetContactTypes`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/roles", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetRoles`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/groups", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {                        
        const result = await new sql.Request(pool)            
        .query(`select * from [group] where active = 1 order by [order] for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);
    });

    app.get("/api/locations", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {                        
        const result = await new sql.Request(pool)            
        .query(`select * from [location] where active = 1 order by [order] for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);
    });
}