import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';
import { CardService } from '../../domain/services/card_services';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    app.get("/api/financial/accounts/:branch_id", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input('branch_id', sql.Int, req.params.branch_id)          
        .query(`select * 
                from account 
                where active = 1
                and branch_id = @branch_id
                order by [order] 
                for json path`, [ req.params.branch_id ]);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/financial_board/expected_payments/:account", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("account_id", sql.Int, req.params.account)     
        .input("start_date", sql.VarChar(10), req.query.start || null)     
        .input("end_date", sql.VarChar(10), req.query.end || null)     
                     
        .execute(`GetPaymentsInPeriod`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/financial_board/account_status/:account", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("account_id", sql.Int, req.params.account)     
        .input("start_date", sql.VarChar(10), req.query.start || null)     
        .input("end_date", sql.VarChar(10), req.query.end || null)     
                     
        .execute(`GetAccountStatusInPeriod`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/financial_board/missing_payments/:account", 
    SecurityService.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("account_id", sql.Int, req.params.account)                            
        .execute(`GetMissingPayments`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

}