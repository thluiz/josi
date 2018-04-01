import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;    
    
    app.post("/api/voucher",
    async (req, res, next) => {              
        try {                       
            const result = await new sql.Request(pool)            
            .input('name', sql.VarChar(200), req.body.name)  
            .input('email', sql.VarChar(100), req.body.email)                  
            .input('cpf', sql.VarChar(11), req.body.cpf)                  
            .input('phone', sql.VarChar(100), req.body.phone)                  
            .input('socialLinks', sql.VarChar(100), req.body.socialLinks)                  
            .input('branch_id', sql.Int, req.body.unit)   
            .input('voucher_id', sql.Int, req.body.voucher_id || 1)
            .input('branch_map_id', sql.Int, req.body.schedule)             
            .execute(`CreatePersonFromVoucher`);         
            
        } catch (error) {
            console.log(error); //TODO: jogar para azure
        }
        res.send({ sucess: true});   
    });

    app.get("/api/voucher", async(req, res, next) => {
        const result = await new sql.Request(pool)          
        .execute(`GetDataForVoucher`);                

        let response = result.recordset[0];

        res.send(response);
    });

    app.get("/api/parameters/vouchers", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {                        
        const result = await new sql.Request(pool)            
        .query(`select * from voucher order by title for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);
    });

    app.post("/api/parameters/vouchers", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {                        
        const voucher = req.body.voucher;

        if(voucher.id > 0) {
            const result = await new sql.Request(pool)            
            .input('id', sql.Int, voucher.id)          
            .input('title', sql.VarChar(100), voucher.title)
            .input('url', sql.VarChar(100), voucher.url)
            .input('initials', sql.VarChar(3), voucher.initials)
            .input('additional_question', sql.VarChar(200), voucher.additional_question)
            .input('header_text', sql.VarChar(sql.MAX), voucher.header_text)
            .query(`update voucher set
                        title = @title,
                        [url] = @url,
                        header_text = @header_text,
                        additional_question = @additional_question,
                        initials = @initials
                    where id = @id`);    
        } else {
            const result = await new sql.Request(pool)                        
            .input('title', sql.VarChar(100), voucher.title)
            .input('url', sql.VarChar(100), voucher.url)
            .input('initials', sql.VarChar(3), voucher.initials)
            .input('additional_question', sql.VarChar(200), voucher.additional_question)
            .input('header_text', sql.VarChar(sql.MAX), voucher.header_text)    
            .query(`insert into voucher (title, [url], header_text, additional_question, initials)
                    values (@title, @url, @header_text, @additional_question, @initials)`); 
        }     

        res.send({ sucess: true});   
    });
    
}
