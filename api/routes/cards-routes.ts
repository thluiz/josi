import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';
import { CardService } from '../../domain/services/card_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    const card_service = new CardService(pool);    

    app.get("/api/person_card_positions", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)            
        .query(`select * from person_card_position where active = 1 for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/operators", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)            
        .query(`select * 
                from vwPerson v 
                where is_operator = 1 or is_director = 1 or is_manager = 1 
                order by name for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/card_templates", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)            
        .query(`select * 
                from card_template 
                where active = 1
                order by [order] 
                for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });
    
    app.get("/api/organizations/:id?/:include_childrens?", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("organization_id", sql.Int, req.params.id > 0 ? req.params.id : null)          
        .input("include_childrens", sql.Int, req.params.include_childrens > 0 ? 1 : 0)
        .execute(`GetOrganizations`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : 
            req.params.id > 0 ? response[0] : response);
    });

    app.post("/api/person_cards", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        let result = await card_service.save_person_card(req.body.person_card);

        res.send({ sucess: true});
    });

    app.post("/api/person_cards/delete", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        let result = await card_service.remove_person_card(req.body.person_card);

        res.send({ sucess: true});
    });

}