import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';
import { CardService } from '../../domain/services/card_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    const person_service = new CardService(pool);    

    app.get("/api/organizations", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)            
        .execute(`GetOrganizations`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/organizations/:id", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("organization_id", sql.Int, req.params.id)          
        .execute(`GetOrganizations`);                

        let response = result.recordset[0][0];

        res.send(response);

    });

}