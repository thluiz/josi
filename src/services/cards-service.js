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
const database_manager_1 = require("./managers/database-manager");
const DBM = new database_manager_1.DatabaseManager();
class CardsService {
    static check_cards_has_overdue_cards() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DBM.ExecuteSPNoResults("CheckCardsHasOverdueCards");
        });
    }
    static correct_card_out_of_parent_step() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DBM.ExecuteSPNoResults("CorrectCardOutOfParentStep");
        });
    }
}
exports.CardsService = CardsService;
//# sourceMappingURL=cards-service.js.map