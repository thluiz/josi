const sql = require('mssql')

export class PersonService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }

    public async add_role(person_id, role_id) {
        const result = await this.sql_pool
                                .request()
                                .input('person_id', sql.Int, person_id)                                
                                .input('role_id', sql.Int, role_id)
                                .execute(`AddPersonRole`);

        return result;                        
    }
    
    public async remove_role(person_id, role_id) {
        const result = await this.sql_pool
                                .request()
                                .input('person_id', sql.Int, person_id)                                
                                .input('role_id', sql.Int, role_id)
                                .execute(`RemovePersonRole`);

        return result;                        
    }

    public async change_kf_name(person_id, kf_name) {
        const result = await this.sql_pool
                                .request()
                                .input('person_id', sql.Int, person_id)                                
                                .input('alias', sql.VarChar(150), kf_name)
                                .input('kf_name', sql.Bit, 1)
                                .execute(`AddAlias`);

        return result;    
    }
}