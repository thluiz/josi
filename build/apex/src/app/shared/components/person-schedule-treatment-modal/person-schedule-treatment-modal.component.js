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
var Observable_1 = require("rxjs/Observable");
var core_1 = require("@angular/core");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var person_service_1 = require("app/services/person-service");
var incident_service_1 = require("app/services/incident-service");
var utils_service_1 = require("app/services/utils-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/map");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/do");
require("rxjs/add/operator/switchMap");
var parameter_service_1 = require("app/services/parameter-service");
var PersonScheduleTreatmentModalComponent = /** @class */ (function () {
    function PersonScheduleTreatmentModalComponent(personService, parameterService, utilsService, incidentService, ngbModalService, datePickerConfig) {
        this.personService = personService;
        this.parameterService = parameterService;
        this.utilsService = utilsService;
        this.incidentService = incidentService;
        this.ngbModalService = ngbModalService;
        this.datePickerConfig = datePickerConfig;
        this.branches = [];
        this.contacts = [];
        this.principal_contacts = [];
        this.show_only_principal_contacts = true;
        this.has_aditional_contacts = false;
        this.without_schedule = false;
        datePickerConfig.firstDayOfWeek = 7;
    }
    PersonScheduleTreatmentModalComponent.prototype.person_id = function () {
        if (!this.person) {
            console.log("person nd");
            return 0;
        }
        return this.person.id || this.person.person_id;
    };
    PersonScheduleTreatmentModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.person_changes_subscriber = this.personService.personChanges$
            .filter(function (data) { return data != null && data.id == _this.person_id(); })
            .subscribe(function (data) {
            _this.load_data();
        });
        //TODO: filter incidents
        this.incident_changes_subscriber = this.incidentService.incidentsChanges$.subscribe(function (data) {
            _this.load_data();
        });
    };
    PersonScheduleTreatmentModalComponent.prototype.ngOnDestroy = function () {
        this.person_changes_subscriber.unsubscribe();
        this.incident_changes_subscriber.unsubscribe();
    };
    PersonScheduleTreatmentModalComponent.prototype.open = function (person) {
        var _this = this;
        this.person = person;
        Observable_1.Observable.zip(this.personService.getPendingSchedule(this.person_id()), this.personService.getPersonContacts(this.person_id()), this.parameterService.getActiveBranches(), function (pending_data, contacts, branches) {
            _this.pending = pending_data.pending[0];
            _this.person = _this.pending.person[0];
            _this.without_schedule = pending_data.pending[0].without_schedule;
            _this.load_contacts(contacts);
            _this.branches = branches;
            if (_this.contacts.length > 0 && _this.principal_contacts.length == 0) {
                _this.show_only_principal_contacts = false;
            }
            _this.open_modal(_this.schedule_treatment_modal, true);
        }).subscribe();
    };
    PersonScheduleTreatmentModalComponent.prototype.open_new_contact = function (content) {
        var _this = this;
        this.parameterService.getContactTypes().subscribe(function (data) {
            _this.open_modal(content);
        });
    };
    PersonScheduleTreatmentModalComponent.prototype.open_modal = function (content, on_close_action) {
        if (on_close_action === void 0) { on_close_action = false; }
        this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    PersonScheduleTreatmentModalComponent.prototype.load_data = function () {
        var _this = this;
        this.personService.getPendingSchedule(this.person_id()).subscribe(function (missing_data) {
            _this.pending = missing_data;
        });
    };
    PersonScheduleTreatmentModalComponent.prototype.load_contacts = function (contacts) {
        this.contacts = contacts;
        this.principal_contacts = this.contacts.filter(function (ct) { return ct.principal; });
        this.has_aditional_contacts = this.principal_contacts.length > 0
            && this.principal_contacts.length != this.contacts.length;
        this.show_only_principal_contacts = this.contacts.filter(function (ct) { return ct.principal; }).length > 0;
    };
    __decorate([
        core_1.ViewChild('schedule_treatment_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], PersonScheduleTreatmentModalComponent.prototype, "schedule_treatment_modal", void 0);
    PersonScheduleTreatmentModalComponent = __decorate([
        core_1.Component({
            selector: 'person-schedule-treatment-modal',
            templateUrl: './person-schedule-treatment-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, typeof (_c = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _c || Object, typeof (_d = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _d || Object, ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbDatepickerConfig])
    ], PersonScheduleTreatmentModalComponent);
    return PersonScheduleTreatmentModalComponent;
    var _a, _b, _c, _d;
}());
exports.PersonScheduleTreatmentModalComponent = PersonScheduleTreatmentModalComponent;
//# sourceMappingURL=person-schedule-treatment-modal.component.js.map