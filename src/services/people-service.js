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
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
const Person_1 = require("../entity/Person");
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
    static check_people_offering_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("GetPersonOfferingAvailable", {
                "save_data": true
            });
        });
    }
    static cancel_expired_people_scheduling() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("CancelExpiredPeopleScheduling");
        });
    }
    static create_person_from_voucher(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("CreatePersonFromVoucher", { "name": data.name }, { "email": data.email }, { "cpf": data.cpf }, { "phone": data.phone }, { "socialLinks": data.socialLinks }, { "branch_id": data.branch_id }, { "voucher_id": data.voucher_id }, { "additionalAnswer": data.additionalAnswer }, { "invite_key": data.invite_key }, { "branch_map_id": data.branch_map_id });
        });
    }
    static save_avatar_image(person_id, blob_image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const PR = yield database_facility_1.DatabaseFacility.getRepository(Person_1.Person);
                const person = yield PR.findOne({ id: person_id });
                person.avatar_img = blob_image;
                yield PR.save(person);
                //TODO: Validate image size
                return result_1.Result.GeneralOk(person);
            }
            catch (error) {
                //TODO: Remove file from blob
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
}
exports.PeopleService = PeopleService;
//# sourceMappingURL=people-service.js.map