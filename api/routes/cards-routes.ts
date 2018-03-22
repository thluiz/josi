import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';
import { CardService } from '../../domain/services/card_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    const card_service = new CardService(pool);    

    app.get("/api/cards/:id", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)   
        .input("card", sql.Int, req.params.id)                   
        .query(`select * from vwCard where id = @card for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

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
    
    app.get("/api/organizations/flat", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)          
        .execute(`GetFlatOrganizationsData`);                

        let response = result.recordset[0];

        res.send(response);
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

    app.get("/api/projects/:id", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {          
        try {
            const result = await new sql.Request(pool)  
            .input("project_id", sql.Int, req.params.id)                  
            .execute(`GetProject`);                

            let response = result.recordset[0];
            
            res.send(response[0].empty ? [] : 
                req.params.id > 0 ? response[0] : response);
        } catch(error)  {   
            console.log(error);
            res.status(500).json(error);
        }
    });

    app.post("/api/person_cards", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        let result = await card_service.save_person_card(req.body.person_card);

        res.send({ sucess: true});
    });

    app.post("/api/cards", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);
        let result = await card_service.save_card(req.body.card, user.person_id);

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : 
            req.params.id > 0 ? response[0] : response);
    });

    app.post("/api/move_card", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);

        const result = await new sql.Request(pool)  
            .input("card_id", sql.Int, req.body.card_id)                  
            .input("parent_id", sql.Int, req.body.parent_id)                  
            .input("step_id", sql.Int, req.body.step_id)                  
            .input("responsible_id", sql.Int, user.person_id)                  
        .execute(`MoveCard`);

        let response = result.recordset[0];

        res.send(response);
    });

    app.post("/api/cards_comments", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);
        let result = await card_service.save_card_comment(req.body.card, req.body.comment, 
            req.body.commentary_type, user.person_id);

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);
    });

    app.get("/api/cards_comments/:card_id", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("card_id", sql.Int, req.params.card_id)                  
        .execute(`GetCardCommentaries`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.post("/api/cards/steps", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);       
        let result = await card_service.save_card_step(req.body.card_id, req.body.step_id, user.person_id);

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response[0]);
    });

    app.post("/api/cards/steps/card_order", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {          
        let result = await card_service.save_card_order(req.body.card_id, req.body.order);

        res.send({ sucess: true});
    });

    app.post("/api/person_cards/delete", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        let result = await card_service.remove_person_card(req.body.person_card);

        res.send({ sucess: true});
    });
    
    app.post("/api/archive_card", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {   
        let user = await SecurityService.getUserFromRequest(req);       
        let result = await card_service.toggle_card_archived(req.body.card, user.person_id);

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response[0]);
    });

}