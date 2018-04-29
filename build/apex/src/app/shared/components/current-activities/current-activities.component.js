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
var core_1 = require("@angular/core");
var modal_service_1 = require("app/services/modal-service");
var incident_service_1 = require("app/services/incident-service");
var person_service_1 = require("app/services/person-service");
var security_service_1 = require("app/services/security-service");
var CurrentActivitiesComponent = /** @class */ (function () {
    function CurrentActivitiesComponent(incidentService, modalService, personService, securityService) {
        this.incidentService = incidentService;
        this.modalService = modalService;
        this.personService = personService;
        this.securityService = securityService;
        this.activities = [];
        this.branch = 0;
    }
    CurrentActivitiesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.securityService.getCurrentUserData().subscribe(function (user) {
            _this.branch = user.default_branch_id || 0;
            _this.getCurrentActivities();
        });
        this.incident_changes_subscriber = this.incidentService.incidentsChanges$
            .delay(1000)
            .subscribe(function (next) {
            _this.getCurrentActivities();
        });
        this.incident_added_subscriber = this.incidentService.incidentAdd$
            .delay(1000)
            .subscribe(function (next) {
            _this.getCurrentActivities();
        });
        this.person_changes_subscriber = this.personService.personChanges$
            .delay(1000).subscribe(function (next) {
            _this.getCurrentActivities();
        });
    };
    CurrentActivitiesComponent.prototype.ngOnDestroy = function () {
        if (this.update_activities_timer) {
            clearTimeout(this.update_activities_timer);
        }
        this.incident_added_subscriber.unsubscribe();
        this.incident_changes_subscriber.unsubscribe();
        this.person_changes_subscriber.unsubscribe();
    };
    CurrentActivitiesComponent.prototype.show_incident_details = function (incident) {
        this.modalService.open(modal_service_1.ModalType.IncidentTreatment, incident);
    };
    CurrentActivitiesComponent.prototype.filter_activities = function (branch) {
        this.branch = branch;
        this.getCurrentActivities();
    };
    CurrentActivitiesComponent.prototype.getCurrentActivities = function () {
        var _this = this;
        this.incidentService.getCurrentActivities(this.branch || 0).subscribe(function (data) {
            _this.activities = data;
        });
        if (this.update_activities_timer) {
            clearTimeout(this.update_activities_timer);
        }
        this.update_activities_timer = setTimeout(function () { _this.getCurrentActivities(); }, 90000);
    };
    CurrentActivitiesComponent.prototype.start_incident = function (incident) {
        var date = new Date();
        incident.started_on_hour = date.getHours() + ":" + date.getMinutes();
        this.incidentService.start_incident(incident)
            .toPromise()
            .catch(function (reason) {
            console.log(reason);
        });
    };
    CurrentActivitiesComponent.prototype.close_incident = function (incident) {
        incident.closed = true;
        this.incidentService.close_incident(incident)
            .toPromise().catch(function (reason) {
            console.log(reason);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CurrentActivitiesComponent.prototype, "branch", void 0);
    CurrentActivitiesComponent = __decorate([
        core_1.Component({
            selector: 'current-activities',
            templateUrl: './current-activities.component.html',
            styleUrls: ['./current-activities.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _a || Object, typeof (_b = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _b || Object, typeof (_c = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _c || Object, typeof (_d = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _d || Object])
    ], CurrentActivitiesComponent);
    return CurrentActivitiesComponent;
    var _a, _b, _c, _d;
}());
exports.CurrentActivitiesComponent = CurrentActivitiesComponent;
//# sourceMappingURL=current-activities.component.js.map