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
}
exports.CardService = CardService;
//# sourceMappingURL=card_services.js.map