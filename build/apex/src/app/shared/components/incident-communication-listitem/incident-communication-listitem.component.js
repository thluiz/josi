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
var IncidentCommunicationListitemComponent = /** @class */ (function () {
    function IncidentCommunicationListitemComponent(incidentService, modalService) {
        this.incidentService = incidentService;
        this.modalService = modalService;
        this.current_branch = 0;
        this.forceCompact = false;
        this.display_status = false;
    }
    IncidentCommunicationListitemComponent.prototype.show_incident_details = function (incident) {
        this.modalService.open(modal_service_1.ModalType.IncidentTreatment, incident);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentCommunicationListitemComponent.prototype, "incident", void 0);
    __decorate([
        core_1.Input("branch"),
        __metadata("design:type", Object)
    ], IncidentCommunicationListitemComponent.prototype, "current_branch", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentCommunicationListitemComponent.prototype, "forceCompact", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentCommunicationListitemComponent.prototype, "display_status", void 0);
    IncidentCommunicationListitemComponent = __decorate([
        core_1.Component({
            selector: 'incident-communication-listitem',
            templateUrl: './incident-communication-listitem.component.html',
            styleUrls: ['./incident-communication-listitem.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _a || Object, typeof (_b = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _b || Object])
    ], IncidentCommunicationListitemComponent);
    return IncidentCommunicationListitemComponent;
    var _a, _b;
}());
exports.IncidentCommunicationListitemComponent = IncidentCommunicationListitemComponent;
//# sourceMappingURL=incident-communication-listitem.component.js.map