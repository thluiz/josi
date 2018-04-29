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
var utils_service_1 = require("./utils-service");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var Rx_1 = require("rxjs/Rx");
var environment_1 = require("../../environments/environment");
var Subject_1 = require("rxjs/Subject");
var IncidentService = /** @class */ (function () {
    function IncidentService(http, utilsService) {
        this.http = http;
        this.utilsService = utilsService;
        this.dataUrl = environment_1.environment.api_url;
        this.incident_added = new Subject_1.Subject();
        this.incident_changes = new Subject_1.Subject(); //TODO map incidents
        this.incidentAdd$ = this.incident_added.asObservable();
        this.incidentsChanges$ = this.incident_changes.asObservable();
        this.currentActivities$ = new Rx_1.ReplaySubject(1);
        this.lastCurrentActivitiesRequest = 0;
        this.comment_changes = new Subject_1.Subject();
        this.commentChanges$ = this.comment_changes.asObservable();
    }
    IncidentService.prototype.getSumary = function (branch, month, week, date) {
        return this.http.get(this.dataUrl + ("/sumary/" + branch + "/" + month + "/" + week + "/" + date));
    };
    IncidentService.prototype.getCurrentActivities = function (branch) {
        var date = new Date();
        var forceRefresh = date.getTime() - this.lastCurrentActivitiesRequest > 5000;
        this.lastCurrentActivitiesRequest = date.getTime();
        return this.utilsService.cache_results(this.currentActivities$, "/current_activities/" + branch, forceRefresh);
    };
    IncidentService.prototype.close_incident = function (incident) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/close', {
            incident: incident
        }).do(function (next) {
            _this.incident_changes.next(incident);
        });
    };
    IncidentService.prototype.remove_incident = function (incident) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/remove', {
            incident: incident
        }).do(function (next) {
            _this.incident_changes.next(incident);
        });
    };
    IncidentService.prototype.reschedule_incident = function (incident, new_incident, contact) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/reschedule', {
            incident: incident, new_incident: new_incident, contact: contact
        }).do(function (next) {
            _this.incident_changes.next(incident);
        });
    };
    IncidentService.prototype.start_incident = function (incident) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/start', {
            incident: incident
        }).do(function (next) {
            _this.incident_changes.next(incident);
        });
    };
    IncidentService.prototype.reopen_incident = function (incident) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/reopen', {
            incident: incident
        }).do(function (next) {
            _this.incident_changes.next(incident);
        });
    };
    IncidentService.prototype.cancel_start_incident = function (incident) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/start/cancel', {
            incident: incident
        }).do(function (next) {
            _this.incident_changes.next(incident);
        });
    };
    IncidentService.prototype.register_contact_for_incident = function (incident, contact) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/register_contact', {
            incident: incident, contact: contact
        }).do(function (next) {
            _this.incident_changes.next(incident);
        });
    };
    IncidentService.prototype.register_new_incident = function (incident) {
        var _this = this;
        return this.http.post(this.dataUrl + '/incident/register_incident', {
            incident: incident
        }).do(function (next) {
            _this.incident_added.next(true);
        });
    };
    IncidentService.prototype.getComments = function (incident_id) {
        return this.http.get(this.dataUrl + ("/incident_comments/incident/" + incident_id));
    };
    IncidentService.prototype.archiveComment = function (comment, incident) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/incident_comments/archive", {
            id: comment.id
        }).map(function (data) {
            _this.comment_changes.next(data);
        });
    };
    IncidentService.prototype.saveComment = function (incident, comment) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/incident_comments", {
            incident_id: incident.id,
            comment: comment
        }).map(function (data) {
            _this.comment_changes.next(data);
        });
    };
    IncidentService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, utils_service_1.UtilsService])
    ], IncidentService);
    return IncidentService;
}());
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident-service.js.map