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
const database_facility_1 = require("../facilities/database-facility");
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
class IncidentsRepository {
    static getPersonIncidentsHistory(person_id, activity_type, page = 1, pagesize = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetPersonIncidentHistory", [
                    { "page": page },
                    { "person_id": person_id },
                    { "activity_type": activity_type }
                ]);
                return result_1.Result.Ok(result);
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.FailedGetConnection, error);
            }
        });
    }
}
exports.IncidentsRepository = IncidentsRepository;
//# sourceMappingURL=incidents-repository.js.map