const sql = require('mssql')

export class SumaryService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }

    async consolidate_members_sumary() {        
        const result = await this.sql_pool
                                .request()                                
                                .execute(`ConsolidateMembersSumary`);

        return result;  
    }

    async consolidate_activity_sumary() {        
        const result = await this.sql_pool
                                .request()                                
                                .execute(`ConsolidateActivitySumary`);

        return result;  
    }
}