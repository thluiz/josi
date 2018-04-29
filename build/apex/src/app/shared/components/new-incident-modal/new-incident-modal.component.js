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
var parameter_service_1 = require("app/services/parameter-service");
var Observable_1 = require("rxjs/Observable");
var core_1 = require("@angular/core");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
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
var NewInicidentModalComponent = /** @class */ (function () {
    function NewInicidentModalComponent(datePickerConfig, ngbModalService, personService, incidentService, parameterService) {
        var _this = this;
        this.datePickerConfig = datePickerConfig;
        this.ngbModalService = ngbModalService;
        this.personService = personService;
        this.incidentService = incidentService;
        this.parameterService = parameterService;
        this.people_typeahead_formatter = function (x) { return x.name; };
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
        datePickerConfig.firstDayOfWeek = 7;
    }
    NewInicidentModalComponent.prototype.ngOnInit = function () {
        this.reset_new_incident();
    };
    NewInicidentModalComponent.prototype.reset_new_incident_type = function () {
        this.new_incident.type = null;
        this.new_incident.tmp_type = null;
        this.new_incident.tmp_combo_type = null;
        this.new_incident.children_type = null;
        this.validate_new_event();
    };
    NewInicidentModalComponent.prototype.open = function (initial_state) {
        var _this = this;
        if (initial_state === void 0) { initial_state = {}; }
        this.reset_new_incident(initial_state);
        Observable_1.Observable.zip(this.parameterService.getActiveBranches(), this.parameterService.getIncidentTypes(), function (branches, incident_types) {
            _this.branches = branches;
            _this.incident_types = incident_types.filter(function (i) { return !i.automatically_generated; });
            _this.open_modal(_this.add_incident_modal, true);
        }).subscribe();
    };
    NewInicidentModalComponent.prototype.open_modal = function (content, on_close_action) {
        if (on_close_action === void 0) { on_close_action = false; }
        this.modalRef = this.ngbModalService.open(content);
        this.modalRef.result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    NewInicidentModalComponent.prototype.add_person_to_new_incident = function (event) {
        if (!event.name) {
            return;
        }
        if (!this.new_incident.people) {
            this.new_incident.people = [];
        }
        this.new_incident.people.push(event);
        this.new_incident.tmp_person = "";
        this.validate_new_event();
    };
    NewInicidentModalComponent.prototype.remove_person_from_new_incident = function (person) {
        this.new_incident.people = this.new_incident.people.filter(function (p) { return p.person_id != person.person_id; });
        this.validate_new_event();
    };
    NewInicidentModalComponent.prototype.validate_new_event_value = function () {
        if (parseFloat(this.new_incident.value) != NaN) {
            this.validate_new_event();
            return;
        }
        this.new_incident.value = 0;
        this.validate_new_event();
    };
    NewInicidentModalComponent.prototype.validate_new_event = function () {
        var new_incident = this.new_incident;
        if (new_incident.people != null
            && new_incident.people.length > 0
            && new_incident.type != null
            && new_incident.branch_id > 0
            && (!this.new_incident.type.need_description
                || ((this.new_incident.description || "").length > 3))
            && (!this.new_incident.type.need_value
                || this.new_incident.value > 0)) {
            this.new_incident.correct = true;
            return;
        }
        this.new_incident.correct = false;
    };
    NewInicidentModalComponent.prototype.change_new_incident_type = function (tp) {
        var t = this.incident_types.filter(function (t) { return t.id == tp; });
        if (t.length != 1) {
            return;
        }
        var type = t[0];
        if (type.childrens != null) {
            this.new_incident.type = null;
            this.new_incident.tmp_type = type;
            this.new_incident.correct = false;
        }
        else {
            this.new_incident.tmp_type = type;
            this.new_incident.type = type;
        }
    };
    NewInicidentModalComponent.prototype.change_new_incident_children_type = function (tp) {
        var t = this.new_incident.tmp_type.childrens.filter(function (t) { return t.id == tp; });
        if (t.length != 1) {
            return;
        }
        var type = t[0];
        this.new_incident.children_type = type;
        this.new_incident.type = type;
    };
    NewInicidentModalComponent.prototype.register_new_incident = function () {
        var _this = this;
        this.incidentService.register_new_incident(this.new_incident)
            .do(function (next) { return _this.reset_new_incident(); })
            .subscribe();
    };
    NewInicidentModalComponent.prototype.reset_new_incident = function (initial_state) {
        if (!initial_state) {
            initial_state = {};
        }
        if (initial_state.start_activity == undefined || initial_state.start_activity == null) {
            initial_state.start_activity = 0;
        }
        var date = new Date();
        this.new_incident = {
            branch_id: initial_state.branch_id,
            contact_text: "",
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            time: {
                hour: date.getHours(),
                minute: date.getMinutes()
            }
        };
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NewInicidentModalComponent.prototype, "current_branch", void 0);
    __decorate([
        core_1.ViewChild('add_incident_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], NewInicidentModalComponent.prototype, "add_incident_modal", void 0);
    NewInicidentModalComponent = __decorate([
        core_1.Component({
            selector: 'new-incident-modal',
            templateUrl: './new-incident-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbDatepickerConfig,
            ng_bootstrap_1.NgbModal, typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _b || Object, typeof (_c = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _c || Object])
    ], NewInicidentModalComponent);
    return NewInicidentModalComponent;
    var _a, _b, _c;
}());
exports.NewInicidentModalComponent = NewInicidentModalComponent;
//# sourceMappingURL=new-incident-modal.component.js.map