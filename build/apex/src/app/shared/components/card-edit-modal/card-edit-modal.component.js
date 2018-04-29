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
var CardEditModalComponent = /** @class */ (function () {
    function CardEditModalComponent(personService, parameterService, utilsService, modalService, cardService, ngbModalService, datePickerConfig) {
        this.personService = personService;
        this.parameterService = parameterService;
        this.utilsService = utilsService;
        this.modalService = modalService;
        this.cardService = cardService;
        this.ngbModalService = ngbModalService;
        this.datePickerConfig = datePickerConfig;
        this.begin_remove = false;
        this.saving = false;
        this.show_actions = false;
        datePickerConfig.firstDayOfWeek = 7;
    }
    CardEditModalComponent.prototype.ngOnInit = function () {
        this.reset_form();
    };
    CardEditModalComponent.prototype.ngOnDestroy = function () {
    };
    CardEditModalComponent.prototype.open = function (card) {
        var _this = this;
        this.card = card;
        this.reset_form();
        if (!card.leaders) {
            card.leaders = [];
        }
        if (!card.locations) {
            card.locations = [];
        }
        if (this.card.due_date && (!this.card.due_time || !this.card.due_time.hour)) {
            this.card.due_time = this.utilsService.translate_time_to_view(this.card.due_date);
        }
        if (this.card.due_date && !this.card.due_date.year) {
            this.card.due_date = this.utilsService.translate_date_to_view(this.card.due_date);
        }
        this.original = JSON.parse(JSON.stringify(this.card));
        Observable_1.Observable.zip(this.parameterService.getActiveBranches(), this.cardService.getOperators(), this.parameterService.getLocations(), function (branches, operators, locations) {
            _this.operators = operators;
            _this.locations = locations;
            _this.open_modal(_this.card_edit_modal, true);
        }).subscribe();
    };
    CardEditModalComponent.prototype.reset_form = function () {
        this.show_actions = false;
        this.saving = false;
        this.begin_remove = false;
    };
    CardEditModalComponent.prototype.entity_compare = function (p1, p2) {
        return p1 != null && p2 != null && p1.id == p2.id;
    };
    CardEditModalComponent.prototype.open_modal = function (content, on_close_action) {
        if (on_close_action === void 0) { on_close_action = false; }
        this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    CardEditModalComponent.prototype.open_move_modal = function (close_action) {
        if (close_action) {
            close_action();
        }
        this.modalService.open(modal_service_1.ModalType.MoveCard, this.card);
    };
    CardEditModalComponent.prototype.validate_edit_card = function () {
    };
    CardEditModalComponent.prototype.cancel = function (close_action) {
        this.reset_card();
        if (close_action) {
            close_action();
        }
    };
    CardEditModalComponent.prototype.update_card = function (close_action) {
        var _this = this;
        this.saving = true;
        this.cardService.updateCard(this.card).subscribe(function (data) {
            if (close_action) {
                _this.saving = false;
                close_action();
            }
        });
    };
    CardEditModalComponent.prototype.archive_card = function (close_action) {
        var _this = this;
        this.saving = true;
        this.cardService.archiveCard(this.card).subscribe(function (data) {
            if (close_action) {
                _this.saving = false;
                close_action();
            }
        });
    };
    CardEditModalComponent.prototype.reset_card = function () {
        this.card.title = this.original.title;
        this.card.due_date = this.original.due_date;
        this.card.description = this.original.description;
        this.card.leaders = this.original.leaders;
    };
    __decorate([
        core_1.ViewChild('card_edit_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], CardEditModalComponent.prototype, "card_edit_modal", void 0);
    CardEditModalComponent = __decorate([
        core_1.Component({
            selector: 'card-edit-modal',
            templateUrl: './card-edit-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, parameter_service_1.ParameterService, typeof (_b = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _b || Object, typeof (_c = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _c || Object, typeof (_d = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _d || Object, ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbDatepickerConfig])
    ], CardEditModalComponent);
    return CardEditModalComponent;
    var _a, _b, _c, _d;
}());
exports.CardEditModalComponent = CardEditModalComponent;
//# sourceMappingURL=card-edit-modal.component.js.map