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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var person_service_1 = require("app/services/person-service");
var parameter_service_1 = require("app/services/parameter-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var security_service_1 = require("app/services/security-service");
var PeopleAwayPageComponent = /** @class */ (function () {
    function PeopleAwayPageComponent(personService, securityService, activatedRoute, router, modalService, parameterService, datePickerConfig) {
        this.personService = personService;
        this.securityService = securityService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.datePickerConfig = datePickerConfig;
        this.current_view = 0;
        this.filters = "1";
        this.current_branch = 0;
        this.search_name = "";
    }
    PeopleAwayPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.current_branch = this.activatedRoute.snapshot.queryParams["branch"] || 0;
        this.search_name = this.activatedRoute.snapshot.queryParams["name"] || "";
        this.parameterService.getActiveBranches().subscribe(function (branches) {
            _this.branches = branches;
        });
        this.securityService.getCurrentUserData().subscribe(function (user) {
            _this.current_branch = _this.activatedRoute.snapshot.queryParams["branch"] || user.default_branch_id || 0;
            _this.load_people_away_list();
        });
    };
    PeopleAwayPageComponent.prototype.ngOnDestroy = function () {
        if (this.person_list_sub) {
            this.person_list_sub.unsubscribe();
        }
    };
    PeopleAwayPageComponent.prototype.apply_filters = function () {
        var _this = this;
        var people = this.all_people;
        if (this.current_branch > 0) {
            people = people.filter(function (p) {
                return p.branch_id == _this.current_branch;
            });
        }
        this.people = people;
    };
    PeopleAwayPageComponent.prototype.filter_people = function () {
        this.router.navigateByUrl("people/away?branch=" + this.current_branch + "&name=" + this.search_name);
        this.load_people_away_list();
    };
    PeopleAwayPageComponent.prototype.keyDownFunction = function (event) {
        if (event.keyCode == 13) {
            this.filter_people();
        }
    };
    PeopleAwayPageComponent.prototype.load_people_away_list = function () {
        var _this = this;
        if (this.person_list_sub) {
            this.person_list_sub.unsubscribe();
        }
        this.person_list_sub = this.personService.getPeopleAwayList(this.current_branch, this.search_name).subscribe(function (data) {
            _this.all_people = data;
            _this.apply_filters();
        });
    };
    PeopleAwayPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './people-away-page.component.html',
            styleUrls: ['../people-customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, router_1.ActivatedRoute,
            router_1.Router,
            ng_bootstrap_1.NgbModal, typeof (_c = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _c || Object, ng_bootstrap_1.NgbDatepickerConfig])
    ], PeopleAwayPageComponent);
    return PeopleAwayPageComponent;
    var _a, _b, _c;
}());
exports.PeopleAwayPageComponent = PeopleAwayPageComponent;
//# sourceMappingURL=people-away-panel-page.component.js.map