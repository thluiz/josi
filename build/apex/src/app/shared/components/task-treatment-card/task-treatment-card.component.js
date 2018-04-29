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
var card_service_1 = require("./../../../services/card-service");
var core_1 = require("@angular/core");
var card_service_2 = require("app/services/card-service");
var parameter_service_1 = require("app/services/parameter-service");
var modal_service_1 = require("app/services/modal-service");
var card_model_1 = require("app/shared/models/card.model");
var TaskTreatmentCardComponent = /** @class */ (function () {
    function TaskTreatmentCardComponent(parameterService, cardService, modalService) {
        this.parameterService = parameterService;
        this.cardService = cardService;
        this.modalService = modalService;
        this.show_actions = false;
    }
    TaskTreatmentCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.card_actions = this.cardService.cardChanges$
            .subscribe(function (action) {
            if (action.type == card_service_2.CARD_COMMENT_ADDED && action.payload.card.id == _this.card.id) {
                _this.card = action.payload.card;
                _this.card.comment_count = action.payload.commentaries.length;
            }
            if (action.type == card_service_2.CARD_CHANGED && action.payload.id == _this.card.id) {
                _this.card = action.payload;
            }
            if (action.type == card_service_1.CARD_MOVED && action.payload.card.id == _this.card.id) {
                _this.card = action.payload.card;
            }
        });
    };
    TaskTreatmentCardComponent.prototype.ngOnDestroy = function () {
        if (this.card_actions) {
            this.card_actions.unsubscribe();
        }
    };
    TaskTreatmentCardComponent.prototype.open_detail_modal = function () {
        this.modalService.open(modal_service_1.ModalType.DetailTask, this.card);
    };
    TaskTreatmentCardComponent.prototype.edit_card = function () {
        this.modalService.open(modal_service_1.ModalType.EditCard, this.card);
    };
    TaskTreatmentCardComponent.prototype.open_move_modal = function (close_action) {
        if (close_action) {
            close_action();
        }
        this.modalService.open(modal_service_1.ModalType.MoveCard, this.card);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", typeof (_a = typeof card_model_1.Card !== "undefined" && card_model_1.Card) === "function" && _a || Object)
    ], TaskTreatmentCardComponent.prototype, "card", void 0);
    TaskTreatmentCardComponent = __decorate([
        core_1.Component({
            selector: 'task-treatment-card',
            templateUrl: './task-treatment-card.component.html',
            styleUrls: ['./task-treatment-card.scss']
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, typeof (_c = typeof card_service_2.CardService !== "undefined" && card_service_2.CardService) === "function" && _c || Object, typeof (_d = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _d || Object])
    ], TaskTreatmentCardComponent);
    return TaskTreatmentCardComponent;
    var _a, _b, _c, _d;
}());
exports.TaskTreatmentCardComponent = TaskTreatmentCardComponent;
//# sourceMappingURL=task-treatment-card.component.js.map