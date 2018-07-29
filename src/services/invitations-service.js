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
const EnumRelationshipType_1 = require("../entity/EnumRelationshipType");
const PersonRelationship_1 = require("../entity/PersonRelationship");
const database_manager_1 = require("./managers/database-manager");
const result_1 = require("../helpers/result");
class InvitationsService {
    static change_invite_type(invite_id, new_type) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.DBF.ExecuteWithinTransaction((qr) => __awaiter(this, void 0, void 0, function* () {
                const invite = yield qr.manager.findOne(PersonRelationship_1.PersonRelationship, { id: invite_id });
                let relationship_type = new_type == 0 ? 13 : new_type == 1 ? 10 : 14;
                invite.relationship_type = yield qr.manager.findOne(EnumRelationshipType_1.EnumRelationshipType, { id: relationship_type });
                yield qr.manager.save(invite);
                return result_1.Result.GeneralOk();
            }));
        });
    }
}
InvitationsService.DBF = new database_manager_1.DatabaseManager();
exports.InvitationsService = InvitationsService;
//# sourceMappingURL=invitations-service.js.map