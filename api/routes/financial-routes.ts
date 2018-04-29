import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';
import { CardService } from '../../domain/services/card_services';
import * as auth from '../../src/middlewares/auth';

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    app.get("/api/financial/accounts/:branch_id?", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input('branch_id', sql.Int, req.params.branch_id || null)          
        .query(`select a.*, isnull(b.abrev, 'Gestão Integrada') branch, isnull(b.initials, 'GI') branch_initials 
                from account a
                    left join branch b on b.id = a.branch_id
                where a.active = 1
                and isnull(a.branch_id, -1) = isnull(@branch_id, isnull(a.branch_id, -1))
                order by [order] 
                for json path`);                
        
        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });

    app.get("/api/financial_board/expected_payments/:account", 
    auth.ensureLoggedIn(),
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
    auth.ensureLoggedIn(),
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
    auth.ensureLoggedIn(),
    async (req, res, next) => {  

        const result = await new sql.Request(pool)  
        .input("account_id", sql.Int, req.params.account)                            
        .execute(`GetMissingPayments`);                

        let response = result.recordset[0];

        res.send(response[0].empty ? [] : response);

    });



    app.post("/api/financial/accounts", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {  
        const account = req.body.account;

        if(account.id > 0) {
            const result = await new sql.Request(pool)            
            .input('id', sql.Int, account.id)          
            .input('name', sql.VarChar(100), account.name)
            .input('order', sql.Int, account.order)        
            .query(`update account set
                        name = @name,
                        [order] = @order
                    where id = @id`);         
        } else {
            const result = await new sql.Request(pool)                        
            .input('name', sql.VarChar(100), account.name)
            .input('order', sql.Int, account.order)        
            .input('branch', sql.Int, account.branch_id > 0 ? account.branch_id : null)
            .query(`insert into account (name, [order], branch_id, active)
                    values (@name, @order, @branch, 1)`);         
        }

        res.send({ sucess: true});

    });

}