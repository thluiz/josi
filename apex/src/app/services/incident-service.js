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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_service_1 = require("./utils-service");
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../environments/environment");
const rxjs_1 = require("rxjs");
exports.INCIDENT_ADDED = "INCIDENT_ADDED";
exports.INCIDENT_STARTED = "INCIDENT_STARTED";
exports.INCIDENT_ENDED = "INCIDENT_ENDED";
exports.INCIDENT_CHANGED = "INCIDENT_CHANGED";
class IncidentAddedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = exports.INCIDENT_ADDED;
    }
}
exports.IncidentAddedAction = IncidentAddedAction;
class IncidentStartedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = exports.INCIDENT_STARTED;
    }
}
exports.IncidentStartedAction = IncidentStartedAction;
class IncidentEndedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = exports.INCIDENT_ENDED;
    }
}
exports.IncidentEndedAction = IncidentEndedAction;
class IncidentChangedAction {
    constructor(payload) {
        this.payload = payload;
        this.type = exports.INCIDENT_CHANGED;
    }
}
exports.IncidentChangedAction = IncidentChangedAction;
let IncidentService = class IncidentService {
    constructor(http, utilsService) {
        this.http = http;
        this.utilsService = utilsService;
        this.dataUrl = environment_1.environment.api_url;
        this.incidents_actions = new rxjs_1.Subject();
        this.incidentsActions$ = this.incidents_actions.asObservable();
    }
    emit_event(data) {
        data.forEach(dt => {
            switch (dt.event_type) {
                case exports.INCIDENT_ADDED:
                    this.incidents_actions.next(new IncidentAddedAction(JSON.parse(dt.data)));
                    break;
                case exports.INCIDENT_STARTED:
                    this.incidents_actions.next(new IncidentStartedAction(JSON.parse(dt.data)));
                    break;
                case exports.INCIDENT_ENDED:
                    this.incidents_actions.next(new IncidentEndedAction(JSON.parse(dt.data)));
                    break;
                case exports.INCIDENT_CHANGED:
                    this.incidents_actions.next(new IncidentChangedAction(JSON.parse(dt.data)));
                    break;
            }
        });
    }
    getSumary(branch, month, week, date) {
        return this.http.get(this.dataUrl + `/sumary/${branch}/${month}/${week}/${date}`);
    }
    getIncidentDetails(incident_id) {
        return this.http.get(this.dataUrl + `/incidents/${incident_id}`);
    }
    getCurrentActivities(branch) {
        let date = new Date();
        return this.http.get(this.dataUrl + `/current_activities/${branch}`);
    }
    close_incident(incident) {
        return this.http.post(this.dataUrl + '/incident/close', {
            id: incident.id
        });
    }
    remove_incident(incident) {
        return this.http.post(this.dataUrl + '/incident/remove', {
            id: incident.id
        });
    }
    reschedule_incident(incident, new_incident, contact) {
        return this.http.post(this.dataUrl + '/incident/reschedule', {
            incident, new_incident, contact
        });
    }
    start_incident(incident) {
        return this.http.post(this.dataUrl + '/incident/start', {
            id: incident.id
        });
    }
    reopen_incident(incident) {
        return this.http.post(this.dataUrl + '/incident/reopen', {
            id: incident.id
        });
    }
    cancel_start_incident(incident) {
        return this.http.post(this.dataUrl + '/incident/start/cancel', {
            id: incident.id
        });
    }
    register_contact_for_incident(incident, contact) {
        return this.http.post(this.dataUrl + '/incident/register_contact', {
            incident, contact
        });
    }
    register_new_incident(incident) {
        return this.http.post(this.dataUrl + '/incident/register_incident', {
            incident
        });
    }
    getComments(incident_id) {
        return this.http.get(this.dataUrl + `/incident_comments/incident/${incident_id}`);
    }
    archiveComment(comment, incident) {
        return this.http.post(this.dataUrl + `/incident_comments/archive`, {
            id: comment.id
        });
    }
    saveComment(incident, comment) {
        return this.http
            .post(this.dataUrl + `/incident_comments`, {
            incident_id: incident.id,
            comment
        });
    }
};
IncidentService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.HttpClient,
        utils_service_1.UtilsService])
], IncidentService);
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident-service.js.map