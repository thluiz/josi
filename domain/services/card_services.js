"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require('mssql');
class CardService {
    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }
    save_card(card, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = card.due_date ? `${card.due_date.year}-${card.due_date.month}-${card.due_date.day}` : null;
            if (date != null && card.due_time) {
                date += ` ${card.due_time.hour}:${card.due_time.minute}`;
            }
            if (card.id && card.id > 0)
                return yield new sql.Request(this.sql_pool)
                    .input('card_id', sql.Int, card.id)
                    .input('title', sql.NVarChar(500), card.title)
                    .input('due_date', sql.VarChar(10), date)
                    .input('description', sql.NVarChar(sql.MAX), card.description)
                    .input('location_id', sql.Int, card.locations != null && card.locations[0] ? card.locations[0].id : 1)
                    .input('leader_id', sql.Int, card.leaders != null && card.leaders[0] ? card.leaders[0].id : (card.leaders.person_id || card.leaders.id))
                    .input('abrev', sql.VarChar(15), card.abrev)
                    .input('responsible_id', sql.Int, responsible_id)
                    .execute(`UpdateCard`);
            return yield new sql.Request(this.sql_pool)
                .input('title', sql.NVarChar(500), card.title)
                .input('parent_id', sql.Int, card.parent.id)
                .input('due_date', sql.VarChar(10), date)
                .input('description', sql.NVarChar(sql.MAX), card.description)
                .input('location_id', sql.Int, card.locations != null && card.locations[0] ? card.locations[0].id : 1)
                .input('card_template_id', sql.Int, card.template ? card.template.id : 3)
                .input('leader_id', sql.Int, card.leaders.person_id || card.leaders.id)
                .input('people', sql.VarChar(sql.MAX), card.people ? card.people.filter(f => f.person_id > 0).map(p => p.person_id).join(",") : null)
                .input('new_people', sql.VarChar(sql.MAX), card.people ? card.people.filter(f => f.person_id == 0).map(p => p.name.trim()).join(",") : null)
                .input('abrev', sql.VarChar(15), card.abrev)
                .input('group_id', sql.Int, card.group ? card.group.id : null)
                .input('branch_id', sql.Int, card.branch ? card.branch.id : null)
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`SaveCard`);
        });
    }
    save_person_card(person_card) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new sql.Request(this.sql_pool)
                .input('card_id', sql.Int, person_card.card_id)
                .input('person_id', sql.Int, person_card.person_id)
                .input('position_id', sql.Int, person_card.position_id || 4)
                .input('position_description', sql.VarChar(100), person_card.position_description || null)
                .input('order', sql.Int, person_card.order || -1)
                .execute(`SavePersonCard`);
        });
    }
    remove_person_card(person_card) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new sql.Request(this.sql_pool)
                .input('card_id', sql.Int, person_card.card_id)
                .input('person_id', sql.Int, person_card.person_id)
                .execute(`RemovePersonCard`);
        });
    }
    toggle_card_archived(card, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new sql.Request(this.sql_pool)
                .input('card_id', sql.Int, card.id)
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`ToggleCardArchived`);
        });
    }
    save_card_step(card_id, step_id, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new sql.Request(this.sql_pool)
                .input('card_id', sql.Int, card_id)
                .input('step_id', sql.Int, step_id)
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`SaveCardStep`);
        });
    }
    save_card_order(card_id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new sql.Request(this.sql_pool)
                .input('card_id', sql.Int, card_id)
                .input('order', sql.Int, order)
                .execute(`SaveCardOrder`);
        });
    }
    save_card_comment(card, commentary, commentary_type, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new sql.Request(this.sql_pool)
                .input('card_id', sql.Int, card.id)
                .input('commentary', sql.NVarChar(sql.MAX), commentary)
                .input('commentary_type', sql.Int, commentary_type || 1)
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`SaveCardCommentary`);
        });
    }
    /**
     * JOBS
     */
    check_cards_has_overdue_cards() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .execute(`CheckCardsHasOverdueCards`);
            return result;
        });
    }
    correct_card_out_of_parent_step() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .execute(`CorrectCardOutOfParentStep`);
            return result;
        });
    }
}
exports.CardService = CardService;
//# sourceMappingURL=card_services.js.map