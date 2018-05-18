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
const PersonRelationship_1 = require("./../entity/PersonRelationship");
const database_facility_1 = require("./../facilities/database-facility");
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
class InvitationsService {
    static change_invite_type(invite_id, new_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_facility_1.DatabaseFacility.getConnection();
            const queryRunner = conn.createQueryRunner();
            try {
                yield queryRunner.startTransaction();
                const invite = yield queryRunner.manager.findOne(PersonRelationship_1.PersonRelationship, { id: invite_id });
                invite.relationship_type.id = new_type == 0 ? 13 : new_type == 1 ? 10 : 14;
                yield queryRunner.manager.save(invite);
                yield queryRunner.commitTransaction();
                return result_1.Result.Ok();
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
}
exports.InvitationsService = InvitationsService;
//# sourceMappingURL=invitations-service.js.map