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
var incident_service_1 = require("app/services/incident-service");
var modal_service_1 = require("app/services/modal-service");
var core_1 = require("@angular/core");
var IncidentAgendaListitemComponent = /** @class */ (function () {
    function IncidentAgendaListitemComponent(incidentService, modalService) {
        this.incidentService = incidentService;
        this.modalService = modalService;
        this.current_branch = 0;
        this.forceCompact = false;
        this.showDate = false;
        this.hideName = false;
    }
    IncidentAgendaListitemComponent.prototype.show_incident_details = function (incident) {
        this.modalService.open(modal_service_1.ModalType.IncidentTreatment, incident);
    };
    IncidentAgendaListitemComponent.prototype.start_incident = function (incident) {
        var date = new Date();
        incident.started_on_hour = date.getHours() + ":" + date.getMinutes();
        this.incidentService.start_incident(incident)
            .toPromise()
            .catch(function (reason) {
            console.log(reason);
        });
    };
    IncidentAgendaListitemComponent.prototype.close_incident = function (incident) {
        incident.closed = true;
        this.incidentService.close_incident(incident)
            .toPromise().catch(function (reason) {
            console.log(reason);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentAgendaListitemComponent.prototype, "incident", void 0);
    __decorate([
        core_1.Input("branch"),
        __metadata("design:type", Object)
    ], IncidentAgendaListitemComponent.prototype, "current_branch", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentAgendaListitemComponent.prototype, "forceCompact", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentAgendaListitemComponent.prototype, "showDate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentAgendaListitemComponent.prototype, "hideName", void 0);
    IncidentAgendaListitemComponent = __decorate([
        core_1.Component({
            selector: 'incident-agenda-listitem',
            templateUrl: './incident-agenda-listitem.component.html',
            styleUrls: ['./incident-agenda-listitem.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _a || Object, typeof (_b = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _b || Object])
    ], IncidentAgendaListitemComponent);
    return IncidentAgendaListitemComponent;
    var _a, _b;
}());
exports.IncidentAgendaListitemComponent = IncidentAgendaListitemComponent;
//# sourceMappingURL=incident-agenda-listitem.component.js.map