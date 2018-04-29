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
var security_service_1 = require("app/services/security-service");
var core_1 = require("@angular/core");
var person_service_1 = require("app/services/person-service");
var parameter_service_1 = require("app/services/parameter-service");
var incident_service_1 = require("app/services/incident-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/delay");
var current_activities_component_1 = require("app/shared/components/current-activities/current-activities.component");
var AgendaPageComponent = /** @class */ (function () {
    function AgendaPageComponent(personService, incidentService, parameterService, modalService, datePickerConfig, securityService) {
        this.personService = personService;
        this.incidentService = incidentService;
        this.parameterService = parameterService;
        this.modalService = modalService;
        this.datePickerConfig = datePickerConfig;
        this.securityService = securityService;
        this.current_week = 0;
        this.current_branch = 0;
        this.current_branch_name = "Todos os Núcleos";
        datePickerConfig.firstDayOfWeek = 7;
        var date = new Date();
        this.current_date = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };
    }
    AgendaPageComponent.prototype.ngAfterViewInit = function () {
    };
    AgendaPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.parameterService.getActiveBranches().subscribe(function (data) {
            var result = data;
            _this.branches = result;
        }, function (err) { return console.error(err); });
        this.parameterService.getIncidentTypes().subscribe(function (data) {
            var result = data;
            _this.manual_incident_types = result.filter(function (i) { return !i.automatically_generated; });
        }, function (err) { return console.error(err); });
        this.incident_changes_subscriber = this.incidentService.incidentsChanges$
            .debounceTime(1000)
            .delay(1000)
            .subscribe(function (next) {
            _this.getAgendaData();
        });
        this.incident_added_subscriber = this.incidentService.incidentAdd$
            .subscribe(function (next) {
            _this.getAgendaData();
        });
        this.securityService.getCurrentUserData().subscribe(function (user) {
            _this.current_branch = user.default_branch_id || 0;
            _this.getAgendaData();
        });
    };
    AgendaPageComponent.prototype.ngOnDestroy = function () {
        if (this.update_agenda_timer) {
            clearTimeout(this.update_agenda_timer);
        }
        this.incident_added_subscriber.unsubscribe();
        this.incident_changes_subscriber.unsubscribe();
    };
    AgendaPageComponent.prototype.change_current_date = function (date) {
        this.getAgendaData();
    };
    AgendaPageComponent.prototype.branchSelected = function (id) {
        var _this = this;
        this.current_branch = id;
        this.filter_incidents();
        this.show_change_branch = false;
        this.current_activities.filter_activities(this.current_branch);
        if (this.current_branch == 0) {
            this.current_branch_name = "Todos os Núcleos";
            return;
        }
        var current = this.branches.find(function (b) { return b.id == _this.current_branch; });
        this.current_branch_name = current.name;
    };
    AgendaPageComponent.prototype.filter_incidents = function () {
        var _this = this;
        this.agenda = [];
        this.original_agenda.forEach(function (original_schedule) {
            var schedule = original_schedule;
            schedule.current_incidents = original_schedule.incidents
                .filter(function (i) { return _this.current_branch == 0 || i.branch_id == _this.current_branch; });
            _this.agenda[_this.agenda.length] = schedule;
        });
    };
    AgendaPageComponent.prototype.open = function (content, incident) {
        var _this = this;
        this.current_incident = incident;
        this.modalService.open(content).result.then(function (result) {
            _this.current_incident = null;
        }, function (reason) {
            console.log(reason);
        });
    };
    AgendaPageComponent.prototype.getAgendaData = function () {
        var _this = this;
        this.personService.getDailyAgenda(0, this.current_date).subscribe(function (data) {
            var result = data;
            _this.original_agenda = result;
            _this.branchSelected(_this.current_branch);
        });
        var d = new Date();
        var hours = d.getHours();
        var update_interval = hours >= 22 || hours < 6 ? 1800000 : 120000;
        if (this.update_agenda_timer) {
            clearTimeout(this.update_agenda_timer);
        }
        this.update_agenda_timer = setTimeout(function () { _this.getAgendaData(); }, update_interval);
    };
    __decorate([
        core_1.ViewChild(current_activities_component_1.CurrentActivitiesComponent),
        __metadata("design:type", typeof (_a = typeof current_activities_component_1.CurrentActivitiesComponent !== "undefined" && current_activities_component_1.CurrentActivitiesComponent) === "function" && _a || Object)
    ], AgendaPageComponent.prototype, "current_activities", void 0);
    AgendaPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './agenda-page.component.html',
            styleUrls: ['../diary.component.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _b || Object, typeof (_c = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _c || Object, typeof (_d = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _d || Object, ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbDatepickerConfig, typeof (_e = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _e || Object])
    ], AgendaPageComponent);
    return AgendaPageComponent;
    var _a, _b, _c, _d, _e;
}());
exports.AgendaPageComponent = AgendaPageComponent;
//# sourceMappingURL=agenda-page.component.js.map