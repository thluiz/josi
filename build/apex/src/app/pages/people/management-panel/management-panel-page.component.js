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
var core_1 = require("@angular/core");
var person_service_1 = require("app/services/person-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var router_1 = require("@angular/router");
var security_service_1 = require("app/services/security-service");
var ManagementPanelPageComponent = /** @class */ (function () {
    function ManagementPanelPageComponent(personService, securityService, route, router, modalService, parameterService, datePickerConfig) {
        this.personService = personService;
        this.securityService = securityService;
        this.route = route;
        this.router = router;
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.datePickerConfig = datePickerConfig;
        this.current_view = 0;
        this.filters = "1";
        this.current_branch = 0;
    }
    ManagementPanelPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router_sub = this.route.params.subscribe(function (params) {
            _this.current_branch = params['branch'] || 0;
            _this.filters = params['filter'] || 1;
            _this.parameterService.getActiveBranches().subscribe(function (branches) {
                _this.branches = branches;
            });
            _this.parameterService.getActiveBranches().subscribe(function (branches) {
                _this.branches = branches;
            });
            _this.securityService.getCurrentUserData().subscribe(function (user) {
                _this.current_branch = params['branch'] || user.default_branch_id || 0;
                _this.load_members_list();
            });
        });
    };
    ManagementPanelPageComponent.prototype.ngOnDestroy = function () {
        this.person_list_sub.unsubscribe();
        this.router_sub.unsubscribe();
    };
    ManagementPanelPageComponent.prototype.apply_filters = function () {
        var _this = this;
        var people = this.all_people;
        switch (this.filters) {
            case "1":
                people = people.filter(function (p) {
                    return p.comunication_status
                        || p.financial_status != 0
                        || p.scheduling_status != 0
                        || p.data_status != 0;
                });
                break;
            case "2":
                people = people.filter(function (p) {
                    return p.data_status != 0;
                });
                break;
            case "3":
                people = people.filter(function (p) {
                    return p.financial_status != 0;
                });
                break;
            case "4":
                people = people.filter(function (p) {
                    return p.scheduling_status != 0;
                });
                break;
            case "5":
                people = people.filter(function (p) {
                    return p.comunication_status;
                });
                break;
            case "6":
                people = people.filter(function (p) {
                    return p.has_birthday_this_month;
                });
                break;
        }
        if (this.current_branch > 0) {
            people = people.filter(function (p) {
                return p.branch_id == _this.current_branch;
            });
        }
        this.people = people;
    };
    ManagementPanelPageComponent.prototype.filter_people = function () {
        this.router.navigateByUrl("people/members/management/" + this.current_branch + "/" + this.filters);
    };
    ManagementPanelPageComponent.prototype.load_members_list = function () {
        var _this = this;
        if (this.person_list_sub) {
            this.person_list_sub.unsubscribe();
        }
        this.person_list_sub = this.personService.getPeopleList().subscribe(function (data) {
            var result = data;
            _this.all_people = result;
            _this.apply_filters();
        });
    };
    ManagementPanelPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './management-panel-page.component.html',
            styleUrls: ['../people-customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, router_1.ActivatedRoute,
            router_1.Router,
            ng_bootstrap_1.NgbModal, typeof (_c = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _c || Object, ng_bootstrap_1.NgbDatepickerConfig])
    ], ManagementPanelPageComponent);
    return ManagementPanelPageComponent;
    var _a, _b, _c;
}());
exports.ManagementPanelPageComponent = ManagementPanelPageComponent;
//# sourceMappingURL=management-panel-page.component.js.map