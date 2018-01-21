const sql = require('mssql')

export class SumaryService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }

    async consolidate_members_sumary() {        
        const result = await new sql.Request(this.sql_pool)                             
                                .execute(`ConsolidateMembersSumary`);

        return result;  
    }

    async consolidate_activity_sumary() {        
        const result = await new sql.Request(this.sql_pool)                               
                                .execute(`ConsolidateActivitySumary`);

        return result;  
    }
}