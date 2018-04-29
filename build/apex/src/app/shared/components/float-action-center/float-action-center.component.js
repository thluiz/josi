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
var modal_service_1 = require("app/services/modal-service");
var core_1 = require("@angular/core");
var CommentType;
(function (CommentType) {
    CommentType[CommentType["Person"] = 0] = "Person";
    CommentType[CommentType["Incident"] = 1] = "Incident";
})(CommentType = exports.CommentType || (exports.CommentType = {}));
var FloatActionCenterComponent = /** @class */ (function () {
    function FloatActionCenterComponent(modalService) {
        this.modalService = modalService;
    }
    FloatActionCenterComponent.prototype.ngOnInit = function () {
    };
    FloatActionCenterComponent.prototype.ngOnDestroy = function () {
    };
    FloatActionCenterComponent.prototype.open_new_person_modal = function () {
        this.modalService.open(modal_service_1.ModalType.AddPerson, { branch_id: this.branch });
    };
    FloatActionCenterComponent.prototype.open_new_activity_modal = function () {
        this.modalService.open(modal_service_1.ModalType.AddIncident, { branch_id: this.branch });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FloatActionCenterComponent.prototype, "branch", void 0);
    FloatActionCenterComponent = __decorate([
        core_1.Component({
            selector: 'float-action-center',
            templateUrl: './float-action-center.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _a || Object])
    ], FloatActionCenterComponent);
    return FloatActionCenterComponent;
    var _a;
}());
exports.FloatActionCenterComponent = FloatActionCenterComponent;
//# sourceMappingURL=float-action-center.component.js.map