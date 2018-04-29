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
var card_service_1 = require("app/services/card-service");
var parameter_service_1 = require("app/services/parameter-service");
var modal_service_1 = require("app/services/modal-service");
var card_model_1 = require("app/shared/models/card.model");
var OrganizationCardComponent = /** @class */ (function () {
    function OrganizationCardComponent(parameterService, cardService, modalService) {
        this.parameterService = parameterService;
        this.cardService = cardService;
        this.modalService = modalService;
        this.compactView = false;
    }
    OrganizationCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.card_actions = this.cardService.cardChanges$
            .filter(function (ca) { return ca.type == card_service_1.CARD_ADDED; })
            .subscribe(function (next) {
            _this.updateOrganization();
        });
    };
    OrganizationCardComponent.prototype.ngOnDestroy = function () {
        if (this.card_actions) {
            this.card_actions.unsubscribe();
        }
    };
    OrganizationCardComponent.prototype.updateOrganization = function () {
        var _this = this;
        this.cardService.getOrganization(this.organization.id, true).subscribe(function (data) {
            _this.organization = data;
        });
    };
    OrganizationCardComponent.prototype.add_task = function (organization) {
        this.modalService.open(modal_service_1.ModalType.AddTask, {
            parent: organization
        });
    };
    OrganizationCardComponent.prototype.add_project = function (organization) {
        this.modalService.open(modal_service_1.ModalType.AddProject, {
            parent: organization
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", typeof (_a = typeof card_model_1.Card !== "undefined" && card_model_1.Card) === "function" && _a || Object)
    ], OrganizationCardComponent.prototype, "organization", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OrganizationCardComponent.prototype, "compactView", void 0);
    OrganizationCardComponent = __decorate([
        core_1.Component({
            selector: 'organization-card',
            templateUrl: './organization-card.component.html',
            styleUrls: ['./organization-card.scss']
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, typeof (_c = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _c || Object, typeof (_d = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _d || Object])
    ], OrganizationCardComponent);
    return OrganizationCardComponent;
    var _a, _b, _c, _d;
}());
exports.OrganizationCardComponent = OrganizationCardComponent;
//# sourceMappingURL=organization-card.component.js.map