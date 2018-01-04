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

    public async change_kf_name(person_id, kf_name, ideograms) {
        const result = await this.sql_pool
                                .request()
                                .input('person_id', sql.Int, person_id)                                
                                .input('alias', sql.VarChar(150), kf_name)
                                .input('kf_name', sql.Bit, 1)
                                .input('ideograms', sql.NVarChar(100), ideograms)
                                .execute(`AddAlias`);

        return result;    
    }

    public async update_person_data(person) {          
        return await this.sql_pool
                                .request()
                                .input('id', sql.Int, person.id)                                                                
                                .input('name', sql.VarChar(200), person.name)
                                .input('birth_date', sql.VarChar(10), person.birth_date)
                                .input('admission_date', sql.VarChar(10), person.admission_date)
                                .input('baaisi_date', sql.VarChar(10), person.baaisi_date)                                
                                .input('kf_name', sql.VarChar(200), person.kf_name)
                                .input('kf_name_ideograms', sql.NVarChar(200), person.kf_name_ideograms)
                                .input('family_id', sql.Int, person.family_id > 0 ? person.family_id : null )                                                                
                                .input('branch_id', sql.Int, person.branch_id > 0 ? person.branch_id : null )
                                .input('domain_id', sql.Int, person.domain_id > 0 ? person.domain_id : null )
                                .input('program_id', sql.Int, person.program_id > 0 ? person.program_id : null )
                                .execute(`UpdatePersonData`);
    }
}