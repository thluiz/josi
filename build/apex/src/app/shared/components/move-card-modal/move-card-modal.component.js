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
var card_service_1 = require("app/services/card-service");
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var MoveCardModalComponent = /** @class */ (function () {
    function MoveCardModalComponent(ngbModalService, cardService) {
        this.ngbModalService = ngbModalService;
        this.cardService = cardService;
    }
    MoveCardModalComponent.prototype.ngOnInit = function () {
    };
    MoveCardModalComponent.prototype.ngOnDestroy = function () {
    };
    MoveCardModalComponent.prototype.open = function (parameter) {
        var _this = this;
        this.card = parameter;
        this.cardService.getFlatOrganizationsData().subscribe(function (data) {
            _this.organizations = data;
            if (_this.card.organization_id > 0) {
                // card in subproject
                _this.new_organization = data.find(function (d) { return d.id == _this.card.organization_id; });
                _this.new_project = _this.new_organization.childs.find(function (c) { return c.id == _this.card.high_level_id; });
                _this.new_sub_project = _this.new_project.subprojects.find(function (c) { return c.id == _this.card.parent_id; });
                _this.new_subproject_step = _this.new_sub_project.steps.find(function (s) { return s.id == _this.card.current_step_id; });
            }
            else if (_this.card.high_level_id > 0) {
                // card in project
                _this.new_organization = data.find(function (d) { return d.id == _this.card.high_level_id; });
                _this.new_project = _this.new_organization.childs.find(function (c) { return c.id == _this.card.parent_id; });
                _this.new_project_step = _this.new_project.steps.find(function (s) { return s.id == _this.card.current_step_id; });
            }
            if (_this.new_organization != null && _this.new_organization.childs != null && _this.new_organization.childs.length > 0) {
                _this.new_organization.childs = _this.new_organization.childs.sort(_this.sortByTitle);
            }
            if (_this.new_project != null && _this.new_project.subprojects != null && _this.new_project.subprojects.length > 0) {
                _this.new_project.subprojects = _this.new_project.subprojects.sort(_this.sortByTitle);
            }
            _this.open_modal(_this.move_card_modal);
        });
    };
    MoveCardModalComponent.prototype.sortByTitle = function (a, b) {
        var firstLetterA = a.title.substring(0, 1);
        var firstLetterB = b.title.substring(0, 1);
        if (a.title > b.title)
            return 1;
        if (a.title < b.title)
            return -1;
        return 0;
    };
    MoveCardModalComponent.prototype.open_modal = function (content) {
        this.ngbModalService.open(content).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    MoveCardModalComponent.prototype.move_card = function (close_action) {
        var parent_id = null;
        var step_id = null;
        if (this.new_sub_project) {
            if (!this.new_subproject_step || this.new_subproject_step.id <= 0) {
                this.errors = "Escolha o passo de destino";
                return;
            }
            parent_id = this.new_sub_project.id,
                step_id = this.new_subproject_step.id;
        }
        else if (this.new_project) {
            if (!this.new_project_step || this.new_project_step.id <= 0) {
                this.errors = "Escolha o passo de destino";
                return;
            }
            parent_id = this.new_project.id,
                step_id = this.new_project_step.id;
        }
        else {
            parent_id = this.new_organization.id;
            step_id = null;
        }
        this.cardService.moveCard(this.card, parent_id, step_id).subscribe(function (data) {
            if (close_action) {
                close_action();
            }
        });
    };
    __decorate([
        core_1.ViewChild('move_card_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], MoveCardModalComponent.prototype, "move_card_modal", void 0);
    MoveCardModalComponent = __decorate([
        core_1.Component({
            selector: 'move-card-modal',
            templateUrl: './move-card-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, typeof (_a = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _a || Object])
    ], MoveCardModalComponent);
    return MoveCardModalComponent;
    var _a;
}());
exports.MoveCardModalComponent = MoveCardModalComponent;
//# sourceMappingURL=move-card-modal.component.js.map