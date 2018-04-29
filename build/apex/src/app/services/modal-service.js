"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var ModalType;
(function (ModalType) {
    ModalType[ModalType["PersonTreatment"] = 0] = "PersonTreatment";
    ModalType[ModalType["IncidentTreatment"] = 1] = "IncidentTreatment";
    ModalType[ModalType["AddPersonComment"] = 2] = "AddPersonComment";
    ModalType[ModalType["AddIncidentComment"] = 3] = "AddIncidentComment";
    ModalType[ModalType["AddCardComment"] = 4] = "AddCardComment";
    ModalType[ModalType["IncidentCommentList"] = 5] = "IncidentCommentList";
    ModalType[ModalType["AddPerson"] = 6] = "AddPerson";
    ModalType[ModalType["AddIncident"] = 7] = "AddIncident";
    ModalType[ModalType["AddTask"] = 8] = "AddTask";
    ModalType[ModalType["AddProject"] = 9] = "AddProject";
    ModalType[ModalType["AddProjectTask"] = 10] = "AddProjectTask";
    ModalType[ModalType["DetailTask"] = 11] = "DetailTask";
    ModalType[ModalType["EditCard"] = 12] = "EditCard";
    ModalType[ModalType["PersonComunicationTreatment"] = 13] = "PersonComunicationTreatment";
    ModalType[ModalType["MoveCard"] = 14] = "MoveCard";
    ModalType[ModalType["PersonFinancialTreatment"] = 15] = "PersonFinancialTreatment";
    ModalType[ModalType["PersonScheduleTreatment"] = 16] = "PersonScheduleTreatment";
})(ModalType = exports.ModalType || (exports.ModalType = {}));
var ModalService = /** @class */ (function () {
    function ModalService() {
        this.open_modal = new Subject_1.Subject();
        this.openModal$ = this.open_modal.asObservable();
    }
    ModalService.prototype.open = function (type, parameters) {
        this.open_modal.next({ type: type, parameters: parameters });
    };
    ModalService = __decorate([
        core_1.Injectable()
    ], ModalService);
    return ModalService;
}());
exports.ModalService = ModalService;
//# sourceMappingURL=modal-service.js.map