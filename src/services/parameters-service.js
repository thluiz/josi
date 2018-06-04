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
const Voucher_1 = require("./../entity/Voucher");
const PersonCardPosition_1 = require("./../entity/PersonCardPosition");
const PersonCard_1 = require("./../entity/PersonCard");
const Location_1 = require("./../entity/Location");
const BranchCategory_1 = require("./../entity/BranchCategory");
const database_facility_1 = require("./../facilities/database-facility");
const result_1 = require("../helpers/result");
const Branch_1 = require("../entity/Branch");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const firebase_emitter_decorator_1 = require("../decorators/firebase-emitter-decorator");
const errors_codes_1 = require("../helpers/errors-codes");
const Country_1 = require("../entity/Country");
const Card_1 = require("../entity/Card");
const Person_1 = require("../entity/Person");
const PARAMETERS_COLLECTION = "parameters-events";
const BRANCH_CREATED = "BRANCH_CREATED";
const BRANCH_UPDATED = "BRANCH_UPDATED";
const BRANCH_CATEGORY_GI = 1;
const VOUCHER_CREATED = "VOUCHER_CREATED";
const VOUCHER_UPDATED = "VOUCHER_UPDATED";
const BRANCHVOUCHER_CREATED = "BRANCH_VOUCHER_CREATED";
const BRANCHVOUCHER_REMOVED = "BRANCH_VOUCHER_REMOVED";
const NOTHING_CHANGED = "NOTHING_CHANGED";
class ParametersService {
    static save_voucher(voucher_data) {
        return __awaiter(this, void 0, void 0, function* () {
            const VR = yield database_facility_1.DatabaseFacility.getRepository(Voucher_1.Voucher);
            return result_1.Result.Ok(voucher_data.id > 0 ? VOUCHER_UPDATED : VOUCHER_CREATED, yield VR.save(voucher_data));
        });
    }
    static create_branch_voucher(branch, voucher) {
        return __awaiter(this, void 0, void 0, function* () {
            const VR = yield database_facility_1.DatabaseFacility.getRepository(Voucher_1.Voucher);
            voucher = yield VR.findOne(voucher.id, { relations: ["branch"] }); //load relation
            if (voucher.branches.find(b => b.id == branch.id)) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.NothingChanged, null);
            }
            voucher.branches.push(branch);
            yield VR.save(voucher);
            return result_1.Result.Ok(BRANCHVOUCHER_CREATED, {
                branch, voucher
            });
        });
    }
    static remove_branch_voucher(branch, voucher) {
        return __awaiter(this, void 0, void 0, function* () {
            const VR = yield database_facility_1.DatabaseFacility.getRepository(Voucher_1.Voucher);
            voucher = yield VR.findOne(voucher.id, { relations: ["branch"] }); //load relation
            if (!voucher.branches.find(b => b.id == branch.id)) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.NothingChanged, null);
            }
            voucher.branches = voucher.branches.filter(b => b.id != branch.id);
            yield VR.save(voucher);
            return result_1.Result.Ok(BRANCHVOUCHER_REMOVED, {
                branch, voucher
            });
        });
    }
    static update_branch(branch) {
        return __awaiter(this, void 0, void 0, function* () {
            const BR = yield database_facility_1.DatabaseFacility.getRepository(Branch_1.Branch);
            return result_1.Result.Ok(BRANCH_UPDATED, yield BR.save(branch));
        });
    }
    static create_branch(branch_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteWithinTransaction((qr) => __awaiter(this, void 0, void 0, function* () {
                const BR = qr.manager.getRepository(Branch_1.Branch);
                const BCR = qr.manager.getRepository(BranchCategory_1.BranchCategory);
                let location = yield this.create_location(qr, branch_data);
                let branch = new Branch_1.Branch();
                branch.abrev = branch_data.abrev;
                branch.active = true;
                branch.category = yield BCR.findOne(branch_data.category_id);
                branch.has_voucher = false;
                branch.initials = branch_data.initials;
                branch.name = branch_data.name;
                branch.location = location;
                branch.order = branch_data.order;
                branch = yield BR.save(branch);
                if (branch_data.category_id == BRANCH_CATEGORY_GI) {
                    const PR = qr.manager.getRepository(Person_1.Person);
                    let director = yield PR.findOne(branch_data.director_id);
                    let second_director = yield PR.findOne(branch_data.associate_director_id);
                    yield this.create_organization(qr, branch, location, director, second_director);
                }
                return result_1.Result.Ok(BRANCH_CREATED, branch);
            }));
        });
    }
    static create_organization(qr, branch, location, director, associate_director) {
        return __awaiter(this, void 0, void 0, function* () {
            const CR = qr.manager.getRepository(Card_1.Card);
            const PCR = qr.manager.getRepository(PersonCard_1.PersonCard);
            const PCPR = qr.manager.getRepository(PersonCardPosition_1.PersonCardPosition);
            const director_position = yield PCPR.findOne(1);
            let organization = new Card_1.Card();
            organization.archived = false;
            organization.cancelled = false;
            organization.abrev = branch.abrev;
            organization.automatically_generated = true;
            organization.title = branch.name;
            organization.location = location;
            organization.leader = director;
            organization.card_template_id = 6;
            organization = yield CR.save(organization);
            let dir = new PersonCard_1.PersonCard();
            dir.person = director;
            dir.position = director_position;
            dir.position_description = "Diretor";
            dir.card = organization;
            yield PCR.save(dir);
            let dir_adj = new PersonCard_1.PersonCard();
            dir_adj.person = associate_director;
            dir_adj.position = director_position;
            dir_adj.position_description = "Diretor Adjunto";
            dir_adj.card = organization;
            yield PCR.save(dir_adj);
            return organization;
        });
    }
    static create_location(qr, branch_data) {
        return __awaiter(this, void 0, void 0, function* () {
            const CR = qr.manager.getRepository(Country_1.Country);
            const LR = qr.manager.getRepository(Location_1.Location);
            let location = new Location_1.Location();
            location.name = branch_data.name;
            location.country = yield CR.findOne(branch_data.country_id);
            location.active = true;
            location.order = 0;
            location = yield LR.save(location);
            return location;
        });
    }
}
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Voucher_1.Voucher]),
    __metadata("design:returntype", Promise)
], ParametersService, "save_voucher", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Branch_1.Branch, Voucher_1.Voucher]),
    __metadata("design:returntype", Promise)
], ParametersService, "create_branch_voucher", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Branch_1.Branch, Voucher_1.Voucher]),
    __metadata("design:returntype", Promise)
], ParametersService, "remove_branch_voucher", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Branch_1.Branch]),
    __metadata("design:returntype", Promise)
], ParametersService, "update_branch", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParametersService, "create_branch", null);
exports.ParametersService = ParametersService;
//# sourceMappingURL=parameters-service.js.map