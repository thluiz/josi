"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
const Person_1 = require("../entity/Person");
const base_service_1 = require("./base-service");
const Role_1 = require("../entity/Role");
const firebase_emitter_decorator_1 = require("../decorators/firebase-emitter-decorator");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
exports.PEOPLE_COLLECTION = "people-events";
exports.PERSON_ADDED = "PERSON_ADDED";
exports.PERSON_UPDATED_ACTION = "PERSON_UPDATED_ACTION";
class PeopleService extends base_service_1.BaseService {
    constructor(databaseManager, dataRunner) {
        super(databaseManager, dataRunner);
    }
    create_person(name, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const RR = yield this.getRepository(Role_1.Role);
            let person = new Person_1.Person();
            person.name = name;
            person.is_interested = role_id == 4;
            person.roles = [(yield RR.findOne(role_id))];
            yield this.save(person);
            return result_1.SuccessResult.Ok(exports.PERSON_ADDED, person);
        });
    }
    check_people_comunication_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("CheckPeopleComunicationStatus");
        });
    }
    check_people_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("CheckPeopleStatus");
        });
    }
    check_people_financial_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("CheckPeopleFinancialStatus");
        });
    }
    check_people_scheduling_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("CheckPeopleSchedulingStatus");
        });
    }
    generate_birthdate_incidents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("GenerateBirthDateIncidents");
        });
    }
    check_people_offering_status() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("GetPersonOfferingAvailable", {
                "save_data": true
            });
        });
    }
    cancel_expired_people_scheduling() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("CancelExpiredPeopleScheduling");
        });
    }
    create_person_from_voucher(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("CreatePersonFromVoucher", { "name": data.name }, { "email": data.email }, { "cpf": data.cpf }, { "phone": data.phone }, { "socialLinks": data.socialLinks }, { "branch_id": data.branch_id }, { "voucher_id": data.voucher_id }, { "additionalAnswer": data.additionalAnswer }, { "invite_key": data.invite_key }, { "branch_map_id": data.branch_map_id });
        });
    }
    save_avatar_image(person_id, blob_image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const PR = yield (yield this.databaseManager)
                    .getRepository(Person_1.Person);
                const person = yield PR.findOne({ id: person_id });
                person.avatar_img = blob_image;
                yield PR.save(person);
                //TODO: Validate image size
                return result_1.SuccessResult.GeneralOk(person);
            }
            catch (error) {
                //TODO: Remove file from blob
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    pin_comment(comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (yield this.databaseManager)
                .ExecuteTypedJsonSP(exports.PERSON_UPDATED_ACTION, "ToglePersonCommentPinned", [{ comment_id: comment_id }], (yield this.dataRunner));
            return result;
        });
    }
}
__decorate([
    trylog_decorator_1.trylog2(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.PEOPLE_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "create_person", null);
exports.PeopleService = PeopleService;
//# sourceMappingURL=people-service.js.map