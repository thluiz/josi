import * as sql from 'mssql';
import { PersonService } from '../../domain/services/person_services';
import { SecurityService } from '../../domain/services/security_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    const person_service = new PersonService(pool);    

    app.get("/api/people/members", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetMembersList`);                

        response.send(result.recordset[0]);
    });

    app.get("/api/people", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetPeopleList`);                

        response.send(result.recordset[0]);
    });
    
    app.get("/api/people/:id", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)
        .input('id', sql.Int, request.params.id)
        .execute(`GetPersonData`);                

        response.send(result.recordset[0][0]);
    });

    app.get("/api/people/search/:name?", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)
        .input('names', sql.VarChar(sql.MAX), request.params.name)
        .execute(`GetPeopleByNameForTypeahead`);                

        response.send(result.recordset[0]);
    });
    
    app.post("/api/people", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => {                        
        try {        
            const result = await person_service.update_person_data(
                request.body.person
            );

            res.send(result.recordset[0][0]);
        } catch(error) {
            res.status(500).json(error);
        }
    });

    app.get("/api/people/:id", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)
        .input('id', sql.Int, request.params.id)
        .execute(`GetPersonData`);                

        response.send(result.recordset[0][0]);
    });

    /**
     * ROLES
     */

    app.post("/api/person_role/delete", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {            
        let result = await person_service.remove_role(
            request.body.person_id, 
            request.body.role_id
        );            

        response.send("Ok");                        
    });

    app.get("/api/person_role", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {                        
        const result = await new sql.Request(pool)            
        .execute(`GetPeopleList`);                

        response.send(result.recordset[0]);
    });


    app.post("/api/person_role", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {            
        let result = await person_service.add_role(
            request.body.person_id, 
            request.body.role_id
        );            

        response.send("Ok");                        
    });

    app.get("/api/person_role/person/:id", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => {                                
        const result = await new sql.Request(pool)
        .input('person_id', sql.Int, request.params.id)
        .execute(`GetPersonRoles`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);
    });

    /**
     * ALIAS
     */

    app.post("/api/people_alias/kf_name", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {            
        let result = await person_service.change_kf_name(
            request.body.person_id, 
            request.body.kf_name,
            request.body.ideograms
        );            

        response.send("Ok");                        
    });

    /** 
     * CONTACTS     
    */

    app.post("/api/person_contact/remove", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => {            
        let result = await person_service.remove_contact(
            request.body.contact_id,                 
        );            

        response.send("Ok");                        
    });

    app.post("/api/person_contact", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => {   
        try {         
            let result = await person_service.save_contact({ 
                    person_id: request.body.person_id,                
                    contact_type: request.body.contact_type,                  
                    contact: request.body.contact,
                    details: request.body.details,
                    principal: request.body.principal
                }
            );            

            res.send("Ok");                        
        } catch (error) {                                
            res.status(500).json(error);
        }
    });

    app.get("/api/person_contact/person/:id/:only_principal?", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => {  
        try {                      
            const result = await new sql.Request(pool)
            .input('person_id', sql.Int, request.params.id)
            .input('only_principal', sql.Int, request.params.only_principal || 0)
            .execute(`GetPersonContacts`);                
            
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);   
                     
        } catch(error)  {   
            console.log(error);
            res.status(500).json(error);
        }
    });

    app.get("/api/person/missing_data/:id", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => {  
        try {                      
            const result = await new sql.Request(pool)
            .input('person_id', sql.Int, request.params.id)            
            .execute(`GetPersonMissingData`);                
            
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);   
                     
        } catch(error)  {   
            console.log(error);
            res.status(500).json(error);
        }
    });

    /**
     * SCHEDULING
     */

    app.post("/api/person_schedule/delete", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => { 
        let result = await person_service.remove_schedule(
            request.body.id
        );            

        response.send("Ok");             
    });

    app.get("/api/person_schedule/person/:id", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => { 
        try {                     
            let result = await new sql.Request(pool)                
                .input('person_id', sql.Int, request.params.id)
                .execute(`GetPersonScheduling`);                
                            
            let response = result.recordset[0];
            
            res.send(response[0].empty ? [] : response);
        } catch (error) {                                
            res.status(500).json(error);
        }              
    });

    app.post("/api/person_schedule", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => { 
        let result = await person_service.save_schedule(
            request.body.schedule
        );            

        response.send("Ok");             
    });

    /**
     * COMMENTS    
     */

    app.get("/api/people_comments/about/:id/:show_archived?", 
    SecurityService.ensureLoggedIn(),
    async (request, res, next) => {  
        try {                      
            const result = await new sql.Request(pool)
            .input('person_id', sql.Int, request.params.id)
            .input('show_archived', sql.Int, request.params.show_archived || 0)
            .execute(`GetCommentsAboutPerson`);                
            
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);   
                     
        } catch(error)  {   
            console.log(error);
            res.status(500).json(error);
        }
    });

    app.post("/api/people_comments/about", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => { 
        let result = await person_service.save_comment_about(
            request.body.person_id,
            request.body.comment
        );            

        response.send("Ok");             
    });

    app.post("/api/people_comments/archive", 
    SecurityService.ensureLoggedIn(),
    async (request, response, next) => { 
        let result = await person_service.archive_comment(
            request.body.id
        );            

        response.send("Ok");             
    });
    
}