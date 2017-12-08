"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let IncidentService = class IncidentService {
    constructor(http) {
        this.http = http;
        //private dataUrl = 'https://myvtmiim.azurewebsites.net/api';
        this.dataUrl = 'http://localhost:3979/api';
    }
    close_incident(incident) {
        return this.http.post(this.dataUrl + '/incident/close', {
            incident
        });
    }
    reschedule_incident(incident, new_incident) {
        return this.http.post(this.dataUrl + '/incident/reschedule', {
            incident, new_incident
        });
    }
    register_contact_for_incident(incident, contact) {
        return this.http.post(this.dataUrl + '/incident/register_contact', {
            incident, contact
        });
    }
};
IncidentService = __decorate([
    core_1.Injectable()
], IncidentService);
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident-service.js.map