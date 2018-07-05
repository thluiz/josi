import { LoggerService, ErrorOrigins } from './../../src/services/logger-service';
import * as sql from 'mssql';
import { CardService } from '../../domain/services/card_services';
import * as auth from '../../src/middlewares/auth';
import { SecurityService } from '../../src/services/security-service';
import { CardsRepository } from '../../src/repositories/cards-repository';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    const card_service = new CardService(pool);    

    app.get("/api/cards/:id", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)   
        .input("card", sql.Int, req.params.id)                   
        .query(`select * from vwCard where id = @card for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/person_card_positions", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)            
        .query(`select * from person_card_position where active = 1 for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/operators", 
    auth.ensureLoggedIn(),
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
    auth.ensureLoggedIn(),
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
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)          
        .execute(`GetFlatOrganizationsData`);                

        let response = result.recordset[0];

        res.send(response);
    });

    app.get("/api/organizations/:id?/:include_childrens?", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  
        try {
            let result = await CardsRepository.getOrganizations(req.params.id, req.params.include_childrens);

            let response = result.data;
    
            res.send(response[0].empty ? [] : req.params.id > 0 ? response[0] : response);            
        } catch (error) {
            LoggerService.error(ErrorOrigins.UnhandledRejection, error, { method: 'getOrganizations'});
            res.status(500).json(error);
        }
    });

    app.get("/api/projects/:id", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {          
        try {
            let result = await CardsRepository.getProject(req.params.id);

            let response = result.data;
            
            res.send(response[0].empty ? [] : 
                req.params.id > 0 ? response[0] : response);
        } catch(error)  {               
            LoggerService.error(ErrorOrigins.UnhandledRejection, error, { method: 'getProject'});
            res.status(500).json(error);
        }
    });

    app.post("/api/person_cards", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        let result = await card_service.save_person_card(req.body.person_card);

        res.send({ sucess: true});
    });

    app.post("/api/cards", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);
        let result = await card_service.save_card(req.body.card, await user.getPersonId());

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : 
            req.params.id > 0 ? response[0] : response);
    });

    app.post("/api/move_card", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);

        const result = await new sql.Request(pool)  
            .input("card_id", sql.Int, req.body.card_id)                  
            .input("parent_id", sql.Int, req.body.parent_id)                  
            .input("step_id", sql.Int, req.body.step_id)                  
            .input("responsible_id", sql.Int, await user.getPersonId())                  
        .execute(`MoveCard`);

        let response = result.recordset[0];

        res.send(response);
    });

    app.post("/api/cards_comments", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);
        let result = await card_service.save_card_comment(req.body.card, req.body.comment, 
            req.body.commentary_type, await user.getPersonId());

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);
    });

    app.get("/api/cards_comments/:card_id", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("card_id", sql.Int, req.params.card_id)                  
        .execute(`GetCardCommentaries`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.post("/api/cards/steps", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {          
        let user = await SecurityService.getUserFromRequest(req);       
        let result = await card_service.save_card_step(req.body.card_id, req.body.step_id, await user.getPersonId());

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response[0]);
    });

    app.post("/api/cards/steps/card_order", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {          
        let result = await card_service.save_card_order(req.body.card_id, req.body.order);

        res.send({ sucess: true});
    });

    app.post("/api/person_cards/delete", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        let result = await card_service.remove_person_card(req.body.person_card);

        res.send({ sucess: true});
    });
    
    app.post("/api/archive_card", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {   
        let user = await SecurityService.getUserFromRequest(req);       
        let result = await card_service.toggle_card_archived(req.body.card, await user.getPersonId());

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response[0]);
    });

}