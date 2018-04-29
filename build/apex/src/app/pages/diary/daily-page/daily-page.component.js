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
var lateral_summary_component_1 = require("./../../../shared/components/lateral-summary/lateral-summary.component");
var core_1 = require("@angular/core");
var person_service_1 = require("app/services/person-service");
var incident_service_1 = require("app/services/incident-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var router_1 = require("@angular/router");
var security_service_1 = require("app/services/security-service");
var DailyPageComponent = /** @class */ (function () {
    function DailyPageComponent(personService, incidentService, securityService, modalService, datePickerConfig, route, router) {
        var _this = this;
        this.personService = personService;
        this.incidentService = incidentService;
        this.securityService = securityService;
        this.modalService = modalService;
        this.datePickerConfig = datePickerConfig;
        this.route = route;
        this.router = router;
        this.current_display = 1;
        this.current_week = 0;
        this.current_branch_name = "";
        this.new_incident = {};
        this.show_change_branch = false;
        datePickerConfig.firstDayOfWeek = 7;
        this.current_week_day = (new Date).getDay() - 1;
        if (this.current_week_day < 0) {
            this.current_week_day = 6;
        }
        this.incident_added_subscriber = incidentService.incidentAdd$.subscribe(function (next) {
            _this.getMonitorData();
        });
        this.incident_changes_subscriber = incidentService.incidentsChanges$.subscribe(function (next) {
            _this.getMonitorData();
        });
    }
    DailyPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.securityService.getCurrentUserData().subscribe(function (user) {
            _this.current_branch = user.default_branch_id || 0;
            _this.getMonitorData();
        });
    };
    DailyPageComponent.prototype.ngOnDestroy = function () {
        if (this.update_members_timer) {
            clearTimeout(this.update_members_timer);
        }
        if (this.update_summary_timer) {
            clearTimeout(this.update_summary_timer);
        }
        if (this.incident_added_subscriber) {
            this.incident_added_subscriber.unsubscribe();
        }
        if (this.incident_changes_subscriber) {
            this.incident_changes_subscriber.unsubscribe();
        }
    };
    DailyPageComponent.prototype.branchSelected = function (id) {
        var _this = this;
        clearTimeout(this.update_members_timer);
        this.update_members_timer = null;
        this.current_branch = id;
        this.getMonitorData();
        this.show_change_branch = false;
        console.log(this.lateralSummaryComponent);
        if (this.lateralSummaryComponent) {
            this.lateralSummaryComponent.forEach(function (ls) {
                ls.branch = _this.current_branch;
                ls.getPeopleSummaryData();
            });
        }
    };
    DailyPageComponent.prototype.change_week = function (modifier) {
        clearTimeout(this.update_members_timer);
        this.update_members_timer = null;
        this.current_week += modifier;
        this.getMonitorData();
    };
    DailyPageComponent.prototype.getMonitorData = function () {
        var _this = this;
        if (!this.personService) {
            return;
        }
        this.personService.getDailyMonitor(this.current_branch, person_service_1.DailyMonitorDisplayType.Day, this.current_week).subscribe(function (data) {
            var result = data;
            _this.branches = result.branches;
            _this.current_branch_name = (_this.current_branch > 0 ?
                _this.branches.filter(function (b) { return b.id == _this.current_branch; })[0].name
                : "Todos os Núcleos");
            _this.domains = result.domains;
            _this.incident_types = result.incident_types;
            _this.manual_incident_types = _this.incident_types.filter(function (f) { return !f.automatically_generated; });
            _this.current_week_range = result.current_week_range;
            _this.week_days = result.week_days;
            _this.selected_week = result.selected_week[0];
            _this.cols = [
                { width: "20%" }
            ];
            for (var i = 0; i < _this.week_days.length; i++) {
                var c = _this.week_days[i];
                _this.cols[_this.cols.length] = {
                    prop: 'incidents' + c.date,
                    name: c.name,
                    current: c.current,
                    width: '60%'
                };
            }
            if (_this.domains) {
                _this.domains.daily = [];
                var _loop_1 = function () {
                    var domain = result.domains[w];
                    _this.domains[w].daily = [];
                    var people = result.people != null ? result.people.filter(function (p) { return p.domain_id == domain.id; }) : [];
                    _this.domains[w].number_of_members = people.length;
                    var _loop_2 = function () {
                        var c = _this.week_days[i];
                        for (var z = 0; z < people.length; z++) {
                            var person_incidents = people[z];
                            if (!person_incidents.dates) {
                                person_incidents.dates = [];
                            }
                            person_incidents.dates[i] = person_incidents.dates[i] || [];
                            var incidents = result.incidents.filter(function (i) {
                                return i.date == c.date && i.person_id == people[z].person_id;
                            });
                            person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);
                            _this.domains[w].daily[z] = person_incidents;
                        }
                    };
                    for (var i = 0; i < _this.week_days.length; i++) {
                        _loop_2();
                    }
                };
                for (var w = 0; w < result.domains.length; w++) {
                    _loop_1();
                }
            }
            _this.load_external_people(result);
        }, function (err) { return console.error(err); });
        var d = new Date();
        var hours = d.getHours();
        var update_interval = hours >= 22 || hours < 6 ? 600000 : 120000;
        if (this.update_members_timer) {
            clearTimeout(this.update_members_timer);
        }
        this.update_members_timer = setTimeout(function () { _this.getMonitorData(); }, update_interval);
    };
    DailyPageComponent.prototype.load_external_people = function (result) {
        var _this = this;
        this.external_people = [];
        var external_people = [];
        if (this.current_branch == 0) {
            external_people = result.people.filter(function (p) { return p.is_interested || p.is_service_provider
                || p.is_associated_with_member || p.is_external_member; });
        }
        else {
            external_people = result.people.filter(function (p) { return p.is_interested || p.is_service_provider
                || p.is_associated_with_member || p.is_external_member || p.branch_id != _this.current_branch; });
        }
        var _loop_3 = function () {
            var c = this_1.week_days[i];
            for (var z = 0; z < external_people.length; z++) {
                var person_incidents = external_people[z];
                if (!person_incidents.dates) {
                    person_incidents.dates = [];
                }
                person_incidents.dates[i] = person_incidents.dates[i] || [];
                var incidents = result.incidents.filter(function (i) {
                    return i.date == c.date && i.person_id == external_people[z].person_id;
                });
                if (incidents.length > 0) {
                    person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);
                }
                this_1.external_people[z] = person_incidents;
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.week_days.length; i++) {
            _loop_3();
        }
    };
    __decorate([
        core_1.ViewChildren(lateral_summary_component_1.LateralSummaryComponent),
        __metadata("design:type", core_1.QueryList)
    ], DailyPageComponent.prototype, "lateralSummaryComponent", void 0);
    DailyPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './daily-page.component.html',
            styleUrls: ['../diary.component.scss'],
            providers: [person_service_1.PersonService, incident_service_1.IncidentService, datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _b || Object, typeof (_c = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _c || Object, ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbDatepickerConfig,
            router_1.ActivatedRoute,
            router_1.Router])
    ], DailyPageComponent);
    return DailyPageComponent;
    var _a, _b, _c;
}());
exports.DailyPageComponent = DailyPageComponent;
//# sourceMappingURL=daily-page.component.js.map