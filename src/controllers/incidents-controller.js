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
const incidents_service_1 = require("../services/incidents-service");
const Incident_1 = require("../entity/Incident");
class IncidentsController {
    constructor(databaseManager, data_runner) {
        this.IS = new incidents_service_1.IncidentsService(databaseManager, data_runner);
    }
    close_incident(incident_data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let ir = yield this.IS.getRepository(Incident_1.Incident);
            let incident = yield ir.findOne(incident_data.id, { relations: ["type"] });
            incident.close_text = incident_data.close_text;
            incident.title = incident_data.title;
            incident.payment_method_id = incident_data.payment_method_id;
            incident.fund_value = incident_data.fund_value;
            let result = yield this.IS.close_incident_and_send_ownership_report(incident, yield user.getPerson());
            return result;
        });
    }
}
exports.IncidentsController = IncidentsController;
//# sourceMappingURL=incidents-controller.js.map