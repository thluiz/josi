import * as sql from 'mssql';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    app.get("/api/branches", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetBranches`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/domains", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetDomains`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/programs", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetPrograms`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/kf_families", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetKungFuFamilies`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/recurrence_types", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetRecurrenceTypes`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/incident_types", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetIncidentTypes`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/contact_types", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetContactTypes`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/roles", async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetRoles`);                

        response.send(result.recordset[0]);
    });
}