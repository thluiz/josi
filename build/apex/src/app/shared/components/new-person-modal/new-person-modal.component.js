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
var utils_service_1 = require("app/services/utils-service");
var modal_service_1 = require("./../../../services/modal-service");
var modal_service_2 = require("app/services/modal-service");
var Observable_1 = require("rxjs/Observable");
var core_1 = require("@angular/core");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var parameter_service_1 = require("app/services/parameter-service");
var person_service_1 = require("app/services/person-service");
var incident_service_1 = require("app/services/incident-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/map");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/do");
require("rxjs/add/operator/switchMap");
var NewPersonModalComponent = /** @class */ (function () {
    function NewPersonModalComponent(datePickerConfig, ngbModalService, personService, incidentService, parameterService, modalService, utilsService) {
        this.datePickerConfig = datePickerConfig;
        this.ngbModalService = ngbModalService;
        this.personService = personService;
        this.incidentService = incidentService;
        this.parameterService = parameterService;
        this.modalService = modalService;
        this.utilsService = utilsService;
        this.branches = [];
        this.incident_types = [];
        this.roles = [];
        this.person = {};
        this.saving = false;
        datePickerConfig.firstDayOfWeek = 7;
    }
    NewPersonModalComponent.prototype.ngOnInit = function () {
        this.reset_person({});
    };
    NewPersonModalComponent.prototype.open = function (initial_state) {
        var _this = this;
        if (initial_state === void 0) { initial_state = {}; }
        this.saving = false;
        this.reset_person(initial_state);
        Observable_1.Observable.zip(this.parameterService.getActiveBranches(), this.parameterService.getRoles(), this.parameterService.getIncidentTypes(), function (branches, roles, incident_types) {
            _this.branches = branches;
            _this.roles = roles.filter(function (r) { return r.allowed_for_new_person; });
            _this.incident_types = incident_types.filter(function (i) { return i.allowed_for_new_person; });
            _this.open_modal(_this.add_person_modal, true);
        }).subscribe();
    };
    NewPersonModalComponent.prototype.validate_new_person = function () {
        this.person.is_valid = true;
        this.person.validation = [];
        if (!this.person.branch_id || +this.person.branch_id <= 0) {
            this.person.is_valid = false;
            this.person.validation[this.person.validation] = "Defina o núcleo";
        }
        if (!this.person.role_id || +this.person.role_id <= 0) {
            this.person.is_valid = false;
            this.person.validation[this.person.validation.length] = "Defina o tipo de cadastro";
        }
        if (!this.person.name || this.person.name.length <= 5) {
            this.person.is_valid = false;
            this.person.validation[this.person.validation.length] = "Informe o nome da pessoa";
        }
        if (!this.person.initial_contact || this.person.initial_contact.length <= 5) {
            this.person.is_valid = false;
            this.person.validation[this.person.validation.length] = "Informe como foi o contato inicial";
        }
        if (this.person.role_id == 4) {
            if (!this.person.next_incident_type || this.person.next_incident_type <= 0) {
                this.person.is_valid = false;
                this.person.validation[this.person.validation.length] = "Qual a próxima atividade da pessoa?";
            }
            else {
                if (!this.person.next_incident_dt) {
                    this.person.is_valid = false;
                    this.person.validation[this.person.validation.length] = "Informe a data da atividade";
                }
                if (!this.person.next_incident_time) {
                    this.person.is_valid = false;
                    this.person.validation[this.person.validation.length] = "Informe o horário da atividade";
                }
            }
        }
    };
    NewPersonModalComponent.prototype.register_new_person = function () {
        var _this = this;
        this.saving = true;
        this.person.birth_date = this.utilsService.translate_date_to_server(this.person.birth_date_tmp);
        this.person.next_incident_date = this.utilsService.translate_date_time_to_server(this.person.next_incident_dt, this.person.next_incident_time);
        this.personService.registerPerson(this.person).subscribe(function (data) {
            _this.modalRef.close(data);
            _this.saving = false;
            _this.modalService.open(modal_service_1.ModalType.PersonTreatment, data);
        });
    };
    NewPersonModalComponent.prototype.reset_person = function (initial_state) {
        if (initial_state === void 0) { initial_state = {}; }
        var date = new Date();
        this.person = {
            branch_id: initial_state.branch_id,
            next_incident_dt: {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            }
        };
    };
    NewPersonModalComponent.prototype.open_modal = function (content, on_close_action) {
        if (on_close_action === void 0) { on_close_action = false; }
        this.modalRef = this.ngbModalService.open(content);
        this.modalRef.result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    __decorate([
        core_1.ViewChild('add_person_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], NewPersonModalComponent.prototype, "add_person_modal", void 0);
    NewPersonModalComponent = __decorate([
        core_1.Component({
            selector: 'new-person-modal',
            templateUrl: './new-person-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbDatepickerConfig,
            ng_bootstrap_1.NgbModal, typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _b || Object, typeof (_c = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _c || Object, typeof (_d = typeof modal_service_2.ModalService !== "undefined" && modal_service_2.ModalService) === "function" && _d || Object, typeof (_e = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _e || Object])
    ], NewPersonModalComponent);
    return NewPersonModalComponent;
    var _a, _b, _c, _d, _e;
}());
exports.NewPersonModalComponent = NewPersonModalComponent;
//# sourceMappingURL=new-person-modal.component.js.map