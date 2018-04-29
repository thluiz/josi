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
var CompactIncidentListitemComponent = /** @class */ (function () {
    function CompactIncidentListitemComponent(modalService) {
        this.modalService = modalService;
    }
    CompactIncidentListitemComponent.prototype.begin_incident_treatment = function (incident) {
        this.modalService.open(modal_service_1.ModalType.IncidentTreatment, incident);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CompactIncidentListitemComponent.prototype, "incident", void 0);
    CompactIncidentListitemComponent = __decorate([
        core_1.Component({
            selector: 'compact-incident-listitem',
            templateUrl: './compact-incident-listitem.component.html',
            styleUrls: ['./compact-incident-listitem.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _a || Object])
    ], CompactIncidentListitemComponent);
    return CompactIncidentListitemComponent;
    var _a;
}());
exports.CompactIncidentListitemComponent = CompactIncidentListitemComponent;
//# sourceMappingURL=compact-incident-listitem.component.js.map