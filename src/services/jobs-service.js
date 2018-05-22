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
const people_service_1 = require("./people-service");
const cards_service_1 = require("./cards-service");
const database_facility_1 = require("../facilities/database-facility");
const axios_1 = require("axios");
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
class JobsService {
    static execute_hourly_jobs() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('start running jobs...');
            let results = [];
            results.push(yield people_service_1.PeopleService.generate_birthdate_incidents());
            results.push(yield people_service_1.PeopleService.cancel_expired_people_scheduling());
            results.push(yield people_service_1.PeopleService.check_people_status());
            results.push(yield people_service_1.PeopleService.check_people_comunication_status());
            results.push(yield people_service_1.PeopleService.check_people_financial_status());
            results.push(yield people_service_1.PeopleService.check_people_scheduling_status());
            results.push(yield cards_service_1.CardsService.correct_card_out_of_parent_step());
            results.push(yield cards_service_1.CardsService.check_cards_has_overdue_cards());
            results.push(yield this.consolidate_members_sumary());
            results.push(yield this.consolidate_activity_sumary());
            console.log('...finished jobs!');
            let err = results.find(r => !r.success);
            if (err)
                return err;
            return result_1.Result.Ok();
        });
    }
    static update_voucher_site() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result_voucher = yield axios_1.default.get(process.env.VOUCHER_SITE_UPDATE_URL);
                if (result_voucher.status != 200)
                    return result_1.Result.Fail(errors_codes_1.ErrorCode.ExternalRequestError, new Error(result_voucher.statusText), null);
                let result_invites = yield axios_1.default.get(process.env.VOUCHER_SITE_UPDATE_INVITES_URL);
                if (result_invites.status != 200)
                    return result_1.Result.Fail(errors_codes_1.ErrorCode.ExternalRequestError, new Error(result_invites.statusText), null);
                return result_1.Result.Ok();
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static consolidate_members_sumary() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("ConsolidateMembersSumary");
        });
    }
    static consolidate_activity_sumary() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("ConsolidateActivitySumary");
        });
    }
}
exports.JobsService = JobsService;
//# sourceMappingURL=jobs-service.js.map