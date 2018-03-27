import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;    
    
    app.post("/api/voucher",
    async (req, res, next) => {                                
        const result = await new sql.Request(pool)            
        .input('name', sql.VarChar(200), req.body.name)  
        .input('email', sql.VarChar(100), req.body.email)                  
        .input('cpf', sql.VarChar(11), req.body.cpf)                  
        .input('phone', sql.VarChar(100), req.body.phone)                  
        .input('socialLinks', sql.VarChar(100), req.body.socialLinks)                  
        .input('branch_id', sql.Int, req.body.unit)                                  
        .execute(`CreatePersonFromVoucher`);         

        res.send({ sucess: true});   
    });
    
}
