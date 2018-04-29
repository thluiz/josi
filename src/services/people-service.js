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
const database_facility_1 = require("./../facilities/database-facility");
class PeopleService {
    static check_people_comunication_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("CheckPeopleComunicationStatus");
        });
    }
    static check_people_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("CheckPeopleStatus");
        });
    }
    static check_people_financial_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("CheckPeopleFinancialStatus");
        });
    }
    static check_people_scheduling_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("CheckPeopleSchedulingStatus");
        });
    }
    static generate_birthdate_incidents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("GenerateBirthDateIncidents");
        });
    }
    static cancel_expired_people_scheduling() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("CancelExpiredPeopleScheduling");
        });
    }
}
exports.PeopleService = PeopleService;
//# sourceMappingURL=people-service.js.map