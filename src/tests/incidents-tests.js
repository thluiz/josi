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
require('dotenv').load();
require("mocha");
const incidents_service_1 = require("../services/incidents-service");
const IF = require("./factories/incident-factory");
const GF = require("./factories/general-factory");
const database_manager_1 = require("../services/managers/database-manager");
const chai_1 = require("chai");
const IncidentType_1 = require("../entity/IncidentType");
describe('Incidents Tests', function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.timeout(15000);
        const dbm = new database_manager_1.DatabaseManager();
        let runner;
        let IS;
        let ITR;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            runner = yield dbm.CreateQueryRunner();
            IS = new incidents_service_1.IncidentsService(dbm, { runner, useTransaction: true, shouldCommit: false });
            ITR = yield runner.manager.getRepository(IncidentType_1.IncidentType);
            yield runner.startTransaction();
        }));
        afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield dbm.RollbackTransaction(runner);
        }));
        it('should create incident', () => __awaiter(this, void 0, void 0, function* () {
            let incident = yield IF.create(runner, yield ITR.findOne(1));
            let registering = yield IS.register_incident2({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success, registering.error ?
                registering.error.message : "").to.be.true;
        }));
        it('should create incident with people', () => __awaiter(this, void 0, void 0, function* () {
            let incident = yield IF.create(runner, yield ITR.findOne(1));
            let registering = yield IS.register_incident2({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success, registering.error ?
                registering.error.message : "").to.be.true;
            chai_1.expect(registering.data[0].people_incidents.length).to.be.eq(1);
        }));
        it('should create one incident for each participant', () => __awaiter(this, void 0, void 0, function* () {
            let incident = yield IF.create(runner, yield ITR.findOne(1));
            let people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
            let registering = yield IS.register_incident2({
                incident,
                people: people,
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success, registering.error ?
                registering.error.message : "").to.be.true;
            chai_1.expect(registering.data.length).to.be.eq(people.length);
        }));
        it('should block incident without title if type require title', () => __awaiter(this, void 0, void 0, function* () {
            let type_requiring_title = yield ITR.findOne({ require_title: true });
            let incident = yield IF.create(runner, type_requiring_title);
            incident.title = "";
            let registering = yield IS.register_incident2({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success).to.be.false;
            chai_1.expect(registering.error.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.TitleNeeded]);
        }));
        it('should block incident without value if type need value', () => __awaiter(this, void 0, void 0, function* () {
            let type_requiring_value = yield ITR.findOne({ need_value: true });
            let incident = yield IF.create(runner, type_requiring_value);
            incident.value = 0;
            let registering = yield IS.register_incident2({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success).to.be.false;
            chai_1.expect(registering.error.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.ValueNeeded]);
        }));
    });
});
//# sourceMappingURL=incidents-tests.js.map