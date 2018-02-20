const sql = require('mssql')

export class CardService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }

    async save_card(card) {
        return await new sql.Request(this.sql_pool)
        .input('title', sql.NVarChar(500), card.title)
        .input('parent_id', sql.Int, card.parent.id)
        .input('due_date', sql.VarChar(10), card.due_date ? `${card.due_date.year}-${card.due_date.month}-${card.due_date.day}` : null)
        .input('description', sql.NVarChar(sql.MAX), card.description)                               
        .input('location_id', sql.Int, card.location_id || 1)            
        .input('card_template_id', sql.Int, card.template_id)            
        .input('leader_id', sql.Int, card.leaders.person_id || card.leaders.id) 
        .input('abrev', sql.VarChar(15), card.abrev)       
        .execute(`SaveCard`);
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

    async save_card_step(card_id, step_id) {
        return await new sql.Request(this.sql_pool)
        .input('card_id', sql.Int, card_id)
        .input('step_id', sql.Int, step_id)
        .execute(`SaveCardStep`);
    }

    async save_card_order(card_id, order) {        
        return await new sql.Request(this.sql_pool)
        .input('card_id', sql.Int, card_id)
        .input('order', sql.Int, order)
        .execute(`SaveCardOrder`);
    }
    
}