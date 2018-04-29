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
var modal_service_1 = require("app/services/modal-service");
var parameter_service_1 = require("./../../../services/parameter-service");
var Observable_1 = require("rxjs/Observable");
var core_1 = require("@angular/core");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var person_service_1 = require("app/services/person-service");
var utils_service_1 = require("app/services/utils-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var CardDetailModalComponent = /** @class */ (function () {
    function CardDetailModalComponent(personService, parameterService, utilsService, modalService, cardService, ngbModalService, datePickerConfig) {
        this.personService = personService;
        this.parameterService = parameterService;
        this.utilsService = utilsService;
        this.modalService = modalService;
        this.cardService = cardService;
        this.ngbModalService = ngbModalService;
        this.datePickerConfig = datePickerConfig;
        this.begin_remove = false;
        this.saving = false;
        datePickerConfig.firstDayOfWeek = 7;
    }
    CardDetailModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reset_form();
        this.card_actions = this.cardService.cardChanges$
            .filter(function (ca) { return ca.type == card_service_1.CARD_COMMENT_ADDED && _this.card && ca.payload.card.id == _this.card.id; })
            .subscribe(function (action) {
            if (!_this.card)
                return;
            _this.commentaries = action.payload.commentaries.sort(function (cm) { return cm.id; });
        });
    };
    CardDetailModalComponent.prototype.ngOnDestroy = function () {
        this.card_actions.unsubscribe();
    };
    CardDetailModalComponent.prototype.show_comments = function () {
    };
    CardDetailModalComponent.prototype.add_comment = function () {
        this.modalService.open(modal_service_1.ModalType.AddCardComment, this.card);
    };
    CardDetailModalComponent.prototype.archive_card = function (close_action) {
        var _this = this;
        this.saving = true;
        this.cardService.archiveCard(this.card).subscribe(function (data) {
            if (close_action) {
                close_action();
                _this.saving = false;
            }
        });
    };
    CardDetailModalComponent.prototype.edit_card = function () {
        this.modalService.open(modal_service_1.ModalType.EditCard, this.card);
    };
    CardDetailModalComponent.prototype.open = function (card) {
        var _this = this;
        this.card = card;
        this.reset_form();
        if (!this.card.locations) {
            this.card.locations = [];
        }
        Observable_1.Observable.zip(this.parameterService.getActiveBranches(), this.cardService.getCardCommentaries(this.card), function (branches, commentaries) {
            _this.commentaries = commentaries;
            _this.open_modal(_this.card_detail_modal, true);
        }).subscribe();
    };
    CardDetailModalComponent.prototype.reset_form = function () {
        this.begin_remove = false;
        this.saving = false;
    };
    CardDetailModalComponent.prototype.open_modal = function (content, on_close_action) {
        if (on_close_action === void 0) { on_close_action = false; }
        this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    __decorate([
        core_1.ViewChild('card_detail_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], CardDetailModalComponent.prototype, "card_detail_modal", void 0);
    CardDetailModalComponent = __decorate([
        core_1.Component({
            selector: 'card-detail-modal',
            templateUrl: './card-detail-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, parameter_service_1.ParameterService, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _b || Object, typeof (_c = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _c || Object, typeof (_d = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _d || Object, ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbDatepickerConfig])
    ], CardDetailModalComponent);
    return CardDetailModalComponent;
    var _a, _b, _c, _d;
}());
exports.CardDetailModalComponent = CardDetailModalComponent;
//# sourceMappingURL=card-detail-modal.component.js.map