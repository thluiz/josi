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
var utils_service_1 = require("app/services/utils-service");
var modal_service_1 = require("./../../../services/modal-service");
var modal_service_2 = require("app/services/modal-service");
var Observable_1 = require("rxjs/Observable");
var core_1 = require("@angular/core");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var parameter_service_1 = require("app/services/parameter-service");
var person_service_1 = require("app/services/person-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/map");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/do");
require("rxjs/add/operator/switchMap");
var CardType;
(function (CardType) {
    CardType[CardType["Task"] = 0] = "Task";
    CardType[CardType["Project"] = 1] = "Project";
    CardType[CardType["ProjectTask"] = 2] = "ProjectTask";
})(CardType = exports.CardType || (exports.CardType = {}));
var NewCardModalComponent = /** @class */ (function () {
    function NewCardModalComponent(datePickerConfig, ngbModalService, personService, cardService, parameterService, modalService, utilsService) {
        var _this = this;
        this.datePickerConfig = datePickerConfig;
        this.ngbModalService = ngbModalService;
        this.personService = personService;
        this.cardService = cardService;
        this.parameterService = parameterService;
        this.modalService = modalService;
        this.utilsService = utilsService;
        this.organizations = [];
        this.incident_types = [];
        this.roles = [];
        this.person = {};
        this.templates = [];
        this.type = CardType.Task;
        this.types = CardType;
        this.card_is_valid = false;
        this.search_failed = false;
        this.searching_people = false;
        this.saving = false;
        this.search_people = function (text$) {
            return text$
                .debounceTime(300)
                .distinctUntilChanged()
                .do(function () { return _this.searching_people = true; })
                .switchMap(function (term) {
                return _this.personService.search(term)
                    .map(function (response) {
                    return response;
                })
                    .do(function () { return _this.search_failed = false; })
                    .catch(function () {
                    _this.search_failed = true;
                    return Observable_1.Observable.of([]);
                });
            })
                .do(function () { return _this.searching_people = false; });
        };
        this.people_typeahead_formatter = function (x) { return x.name; };
        datePickerConfig.firstDayOfWeek = 7;
    }
    NewCardModalComponent.prototype.ngOnInit = function () {
        this.reset_card({});
    };
    NewCardModalComponent.prototype.open = function (initial_state) {
        var _this = this;
        if (initial_state === void 0) { initial_state = {}; }
        this.saving = false;
        this.type = initial_state.card_type || CardType.Task;
        Observable_1.Observable.zip(this.cardService.getOrganizations(true), this.parameterService.getCardTemplates(), this.cardService.getOperators(), this.parameterService.getGroups(), this.parameterService.getActiveBranches(), this.parameterService.getLocations(), function (organizations, templates, operators, groups, branches, locations) {
            _this.organizations = organizations;
            _this.locations = locations;
            _this.operators = operators;
            _this.groups = groups;
            _this.branches = branches;
            _this.templates = templates.filter(function (t) { return !t.automatically_generated
                && t.active
                && t.is_task == (_this.type == CardType.Task || _this.type == CardType.ProjectTask); })
                .map(function (template) {
                var transformed = template;
                transformed.name = transformed.name.replace('Projeto - ', '');
                return transformed;
            });
            _this.reset_card(initial_state);
            _this.open_modal(_this.add_card_modal, true);
        }).subscribe();
    };
    NewCardModalComponent.prototype.validate_new_card = function () {
        this.card_is_valid = true;
        this.card_validation = [];
        if (!this.card.parent) {
            this.card_is_valid = false;
            this.card_validation[this.card_validation.length] = "Informe a organização";
        }
        if (!this.card.leaders) {
            this.card_is_valid = false;
            this.card_validation[this.card_validation.length] = "Informe o responsável";
        }
        if (this.card.template) {
            if (this.card.template.require_target && (!this.card.people || this.card.people.length == 0)) {
                this.card_is_valid = false;
                this.card_validation[this.card_validation.length] = "Informe o interlocutor da tarefa";
            }
            if (this.card.template.require_target_group && !this.card.group) {
                this.card_is_valid = false;
                this.card_validation[this.card_validation.length] = "Informe o grupo para gerar as tarefas";
            }
            if (this.card.group && !this.card.branch && !this.card.group.allow_no_branch) {
                this.card_is_valid = false;
                this.card_validation[this.card_validation.length] = "Informe o subgrupo para gerar as tarefas";
            }
        }
        if (!this.card.title || this.card.title.length <= 5) {
            this.card_is_valid = false;
            this.card_validation[this.card_validation.length] = "Informe o título";
        }
        if (this.type == CardType.Project) {
        }
    };
    NewCardModalComponent.prototype.register_new_person = function () {
        var _this = this;
        this.person.birth_date = this.utilsService.translate_date_to_server(this.person.birth_date_tmp);
        this.person.next_incident_date = this.utilsService.translate_date_time_to_server(this.person.next_incident_dt, this.person.next_incident_time);
        this.personService.registerPerson(this.person).subscribe(function (data) {
            _this.modalRef.close(data);
            _this.modalService.open(modal_service_1.ModalType.PersonTreatment, data);
        });
    };
    NewCardModalComponent.prototype.register_new_card = function () {
        var _this = this;
        this.saving = true;
        if (!this.card.template.require_target) {
            this.card.people = null;
        }
        this.cardService.saveCard(this.card).subscribe(function (data) {
            _this.saving = false;
            if (_this.modalRef) {
                _this.modalRef.close(data);
            }
        });
    };
    NewCardModalComponent.prototype.entity_compare = function (p1, p2) {
        return p1 != null && p2 != null && p1.id == p2.id;
    };
    NewCardModalComponent.prototype.remove_person_from_new_card = function (person) {
        this.card.people = this.card.people.filter(function (p) { return p.person_id != person.person_id; });
        this.validate_new_card();
    };
    NewCardModalComponent.prototype.add_person_to_new_card = function (event) {
        if (!event.name) {
            return;
        }
        if (!this.card.people) {
            this.card.people = [];
        }
        this.card.people.push(event);
        this.card.tmp_person = "";
        this.validate_new_card();
    };
    NewCardModalComponent.prototype.reset_card = function (initial_state) {
        this.card = initial_state;
        if (initial_state && initial_state.parent != null && initial_state.parent.leaders && initial_state.parent.leaders.length > 0) {
            this.card.leaders = initial_state.parent.leaders[0];
        }
        if (!this.card.template && this.templates && this.templates.length > 0) {
            this.card.template = this.templates[0];
        }
        if (!this.card.locations && this.locations && this.locations.length > 0) {
            this.card.locations = [];
            this.card.locations[0] = this.locations[0];
            if (initial_state && initial_state.parent != null && initial_state.parent.locations && initial_state.parent.locations.length > 0) {
                this.card.locations[0] = initial_state.parent.locations[0];
            }
        }
        this.validate_new_card();
    };
    NewCardModalComponent.prototype.open_modal = function (content, on_close_action) {
        if (on_close_action === void 0) { on_close_action = false; }
        this.modalRef = this.ngbModalService.open(content);
        this.modalRef.result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    __decorate([
        core_1.ViewChild('add_card_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], NewCardModalComponent.prototype, "add_card_modal", void 0);
    NewCardModalComponent = __decorate([
        core_1.Component({
            selector: 'new-card-modal',
            templateUrl: './new-card-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbDatepickerConfig,
            ng_bootstrap_1.NgbModal, typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, card_service_1.CardService, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, typeof (_c = typeof modal_service_2.ModalService !== "undefined" && modal_service_2.ModalService) === "function" && _c || Object, typeof (_d = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _d || Object])
    ], NewCardModalComponent);
    return NewCardModalComponent;
    var _a, _b, _c, _d;
}());
exports.NewCardModalComponent = NewCardModalComponent;
//# sourceMappingURL=new-card-modal.component.js.map