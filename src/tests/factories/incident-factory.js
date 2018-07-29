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
const Branch_1 = require("./../../entity/Branch");
const Incident_1 = require("../../entity/Incident");
function create(runner, type, title = "Test", branch_id = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        let BR = yield runner.manager.getRepository(Branch_1.Branch);
        let incident = new Incident_1.Incident();
        incident.type = type;
        incident.title = title;
        incident.date = new Date();
        incident.branch = (yield BR.findOne(branch_id));
        return incident;
    });
}
exports.create = create;
//# sourceMappingURL=incident-factory.js.map