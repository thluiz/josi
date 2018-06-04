import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';
import * as auth from '../../src/middlewares/auth';
import { JobsService } from '../../src/services/jobs-service';

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
            .input('additionalAnswer', sql.VarChar(sql.MAX), req.body.additionalAnswer || '')
            .input('invite_key', sql.VarChar(60), req.body.invite)
            .input('branch_map_id', sql.Int, req.body.schedule)             
            .execute(`CreatePersonFromVoucher`);
            
        } catch (error) {            
            console.log(error);
        }
        res.send({ sucess: true});   
    });

    app.get("/api/voucher/:id?", async(req, res, next) => {
        const result = await new sql.Request(pool)          
                                    .execute(`GetDataForVoucher`);                

        let response = result.recordset[0];

        res.send(response);
    });

    app.get("/api/voucher/invites", async(req, res, next) => {
        const result = await new sql.Request(pool)          
        .execute(`GetInvitesForVoucher`);                

        let response = result.recordset[0];

        res.send(response);
    });
   
}
