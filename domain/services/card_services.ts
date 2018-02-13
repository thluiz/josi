const sql = require('mssql')

export class CardService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }

    async save_person_card(person_card) {
        return await new sql.Request(this.sql_pool)
            .input('card_id', sql.Int, person_card.card_id)
            .input('person_id', sql.Int, person_card.person_id)
            .input('position_id', sql.Int, person_card.position_id || 4)            
            .input('position_description', sql.VarChar(100), person_card.position_description || null)            
            .input('order', sql.Int, person_card.order || -1)
            .execute(`SavePersonCard`);
    }

    async remove_person_card(person_card) {
        return await new sql.Request(this.sql_pool)
        .input('card_id', sql.Int, person_card.card_id)
        .input('person_id', sql.Int, person_card.person_id)
        .execute(`RemovePersonCard`);
    }
}