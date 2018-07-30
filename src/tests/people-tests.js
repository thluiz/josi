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
const database_manager_1 = require("../services/managers/database-manager");
const chai_1 = require("chai");
const people_service_1 = require("../services/people-service");
describe('People Tests', function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.timeout(15000);
        const dbm = new database_manager_1.DatabaseManager();
        let runner;
        let PS;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            runner = yield dbm.CreateQueryRunner();
            PS = new people_service_1.PeopleService(dbm, { runner, useTransaction: true, shouldCommit: false });
            yield dbm.StartTransaction(runner);
        }));
        afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield dbm.RollbackTransaction(runner);
        }));
        it('should create person', () => __awaiter(this, void 0, void 0, function* () {
            let result = yield PS.create_person("TESTE person name", 4);
            chai_1.expect(result.success);
            chai_1.expect(result.data.id).to.be.greaterThan(0);
        }));
        it('should create interested', () => __awaiter(this, void 0, void 0, function* () {
            let result = yield PS.create_person("TESTE person name", 4);
            chai_1.expect(result.success);
            chai_1.expect(result.data.is_interested).to.be.true;
        }));
    });
});
//# sourceMappingURL=people-tests.js.map