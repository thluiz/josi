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
const configurations_services_1 = require("../services/configurations-services");
const incidents_repository_1 = require("../repositories/incidents-repository");
describe('Incidents Tests', function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.timeout(15000000);
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
        describe('Create Incidents Tests', function () {
            return __awaiter(this, void 0, void 0, function* () {
                it('should create incident', () => __awaiter(this, void 0, void 0, function* () {
                    let incident = yield IF.create(runner, yield ITR.findOne(1));
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
                    });
                    chai_1.expect(registering.success, registering.data ?
                        registering.data.message : "").to.be.true;
                }));
                it('should create incident with people', () => __awaiter(this, void 0, void 0, function* () {
                    let incident = yield IF.create(runner, yield ITR.findOne(1));
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
                    });
                    chai_1.expect(registering.success, registering.data ?
                        registering.data.message : "").to.be.true;
                    chai_1.expect(registering.data[0].people_incidents.length).to.be.eq(1);
                }));
                it('should create incident in existing ownership', () => __awaiter(this, void 0, void 0, function* () {
                    let type_ownership = yield ITR.findOne(configurations_services_1.Constants.IncidentTypeOwnership);
                    let ownership_data = yield IF.create(runner, type_ownership);
                    let ownership_register = yield IS.create_ownership({
                        incident: ownership_data,
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        new_owner: yield GF.create_person(runner),
                        new_support: yield GF.create_person(runner)
                    });
                    chai_1.expect(ownership_register.success, ownership_register.message).to.be.true;
                    let ownership_and_support = ownership_register.data;
                    chai_1.expect(ownership_and_support.ownership.id).to.be.greaterThan(0);
                    let type_requiring_ownership = yield ITR.findOne({ require_ownership: true });
                    let incident = yield IF.create(runner, type_requiring_ownership);
                    let people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: people,
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        ownership: ownership_and_support.ownership,
                        addToOwnership: incidents_service_1.AddToOwnership.AddToExistingOwnership,
                    });
                    chai_1.expect(registering.success, registering.message).to.be.true;
                    chai_1.expect(registering.data[0].ownership.id).to.be.eq(ownership_and_support.ownership.id);
                    chai_1.expect(registering.data[1].ownership.id).to.be.eq(ownership_and_support.ownership.id);
                }));
                it('should create one incident for each participant', () => __awaiter(this, void 0, void 0, function* () {
                    let incident = yield IF.create(runner, yield ITR.findOne(1));
                    let people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: people,
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
                    });
                    chai_1.expect(registering.success, registering.data ?
                        registering.data.message : "").to.be.true;
                    chai_1.expect(registering.data.length).to.be.eq(people.length);
                }));
                it('should create incident with new ownership', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_ownership = yield ITR.findOne({ require_ownership: true });
                    let incident = yield IF.create(runner, type_requiring_ownership);
                    let people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: people,
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        new_owner: (yield GF.create_person(runner)),
                        new_support: (yield GF.create_person(runner)),
                        addToOwnership: incidents_service_1.AddToOwnership.AddToNewOwnership,
                    });
                    chai_1.expect(registering.success, registering.message).to.be.true;
                    let ownership = registering.data.find(i => i.type.id === configurations_services_1.Constants.IncidentTypeOwnership);
                    let support = registering.data.find(i => i.type.id === configurations_services_1.Constants.IncidentTypeSupport);
                    let incidents = registering.data.filter(i => i.type.id !== configurations_services_1.Constants.IncidentTypeOwnership
                        && i.type.id !== configurations_services_1.Constants.IncidentTypeSupport);
                    chai_1.expect(ownership.id).to.be.greaterThan(0);
                    chai_1.expect(support.id).to.be.greaterThan(0);
                    chai_1.expect(incidents.length)
                        .to.be.equals(people.length, "should return one incident for each participant");
                    chai_1.expect(incidents.length + 2)
                        .to.be.equals(registering.data.length, "should return one incident for each person and one ownership and one support");
                    chai_1.expect(incidents.filter(i => i.ownership.id == ownership.id).length)
                        .to.be.equals(incidents.length, "should return all incidents with the same ownership");
                }));
                it('should not create incident without title if type require it', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_title = yield ITR.findOne({ require_title: true });
                    let incident = yield IF.create(runner, type_requiring_title);
                    incident.title = "";
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
                    });
                    chai_1.expect(registering.success).to.be.false;
                    chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.TitleNeeded]);
                }));
                it('should not create incident without ownership if type require it', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_ownership = yield ITR.findOne({ require_ownership: true });
                    let incident = yield IF.create(runner, type_requiring_ownership);
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
                    });
                    chai_1.expect(registering.success).to.be.false;
                    chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnership]);
                }));
                it('should not create incident without ownership if type require it and new support has not been sent', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_ownership = yield ITR.findOne({ require_ownership: true });
                    let incident = yield IF.create(runner, type_requiring_ownership);
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        new_owner: (yield GF.create_person(runner)),
                        addToOwnership: incidents_service_1.AddToOwnership.AddToNewOwnership,
                    });
                    chai_1.expect(registering.success).to.be.false;
                    chai_1.expect(registering.data.message)
                        .to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnerOrSupport]);
                }));
                it('should not create incident without ownership if type require it and new owner has not been sent', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_ownership = yield ITR.findOne({ require_ownership: true });
                    let incident = yield IF.create(runner, type_requiring_ownership);
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.AddToNewOwnership,
                    });
                    chai_1.expect(registering.success).to.be.false;
                    chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnerOrSupport]);
                }));
                it('should not create incident without ownership if type require it and new owner has not been sent', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_ownership = yield ITR.findOne({ require_ownership: true });
                    let incident = yield IF.create(runner, type_requiring_ownership);
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.AddToExistingOwnership,
                    });
                    chai_1.expect(registering.success).to.be.false;
                    chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnership]);
                }));
                it('should not create incident with new ownership sending as to add to existing ownership', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_ownership = yield ITR.findOne({ require_ownership: true });
                    let incident = yield IF.create(runner, type_requiring_ownership);
                    let people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: people,
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        new_owner: people[0],
                        new_support: people[1],
                        addToOwnership: incidents_service_1.AddToOwnership.AddToExistingOwnership,
                    });
                    chai_1.expect(registering.success).to.be.false;
                    chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnership]);
                }));
                it('should not create incident without value if type require it', () => __awaiter(this, void 0, void 0, function* () {
                    let type_requiring_value = yield ITR.findOne({ need_value: true });
                    let incident = yield IF.create(runner, type_requiring_value);
                    incident.value = 0;
                    let registering = yield IS.create_people_incidents({
                        incident,
                        people: [(yield GF.create_person(runner))],
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false,
                        addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
                    });
                    chai_1.expect(registering.success).to.be.false;
                    chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.ValueNeeded]);
                }));
            });
        });
        describe('Close Incidents Tests', function () {
            return __awaiter(this, void 0, void 0, function* () {
                it('should close incident', () => __awaiter(this, void 0, void 0, function* () {
                    const incident_data = yield IF.create(runner, yield ITR.findOne(1));
                    const registering = yield IS.create_incident_for_person({
                        incident: incident_data,
                        person: (yield GF.create_person(runner)),
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false
                    });
                    const closing_result = yield IS.close_incident(registering.data, yield GF.create_responsible(runner));
                    chai_1.expect(closing_result.success, closing_result.message).to.be.true;
                    let IR = yield incidents_repository_1.IncidentsRepository.getRepository(runner);
                    let incident = (yield IR.findOne(registering.data.id));
                    chai_1.expect(incident.closed).to.be.true;
                }));
                it('should close ownership', () => __awaiter(this, void 0, void 0, function* () {
                    const incident_data = yield IF.create(runner, yield ITR.findOne(configurations_services_1.Constants.IncidentTypeOwnership));
                    const registering = yield IS.create_incident_for_person({
                        incident: incident_data,
                        person: (yield GF.create_person(runner)),
                        responsible: (yield GF.create_responsible(runner)),
                        register_closed: false,
                        register_treated: false,
                        start_activity: false
                    });
                    const closing_result = yield IS.close_incident(registering.data, yield GF.create_responsible(runner));
                    chai_1.expect(closing_result.success, closing_result.message).to.be.true;
                    let IR = yield incidents_repository_1.IncidentsRepository.getRepository(runner);
                    let incident = (yield IR.findOne(registering.data.id));
                    chai_1.expect(incident.closed).to.be.true;
                }));
            });
        });
    });
});
//# sourceMappingURL=incidents-tests.js.map