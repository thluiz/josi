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
const chai_1 = require("chai");
const incidents_service_1 = require("../../services/incidents-service");
const ownership_closing_report_1 = require("../../services/reports/ownership-closing-report");
const IF = require("../factories/incident-factory");
const GF = require("../factories/general-factory");
const database_manager_1 = require("../../services/managers/database-manager");
const IncidentType_1 = require("../../entity/IncidentType");
const configurations_services_1 = require("../../services/configurations-services");
const incidents_repository_1 = require("../../repositories/incidents-repository");
describe('Reporting Tests', function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.timeout(15000000);
        let runner;
        let IS;
        let ITR;
        const dbm = new database_manager_1.DatabaseManager();
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            runner = yield dbm.CreateQueryRunner();
            IS = new incidents_service_1.IncidentsService(dbm, { runner, useTransaction: true, shouldCommit: false });
            ITR = yield runner.manager.getRepository(IncidentType_1.IncidentType);
            yield runner.startTransaction();
        }));
        afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield dbm.RollbackTransaction(runner);
        }));
        it('should send ownership report', () => __awaiter(this, void 0, void 0, function* () {
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
            let result = yield ownership_closing_report_1.OwnershipClosingReport.send(incident);
            chai_1.expect(result.success).to.be.true;
        }));
    });
});
//# sourceMappingURL=report-tests.js.map