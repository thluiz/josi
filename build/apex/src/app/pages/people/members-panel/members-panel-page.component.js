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
var person_service_1 = require("app/services/person-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var router_1 = require("@angular/router");
var parameter_service_1 = require("app/services/parameter-service");
var security_service_1 = require("app/services/security-service");
var MembersPanelPageComponent = /** @class */ (function () {
    function MembersPanelPageComponent(personService, securityService, route, router, modalService, parameterService, datePickerConfig) {
        this.personService = personService;
        this.securityService = securityService;
        this.route = route;
        this.router = router;
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.datePickerConfig = datePickerConfig;
    }
    MembersPanelPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.person_changes_subscriber = this.personService.personChanges$
            .subscribe(function (data) {
            _this.load_members_list();
        });
        this.contact_changes_subscriber = this.personService.contactChanges$
            .subscribe(function (data) {
            _this.load_members_list();
        });
        this.parameterService.getActiveBranches().subscribe(function (branches) {
            _this.branches = branches;
        });
        this.securityService.getCurrentUserData().subscribe(function (user) {
            //this.current_branch = params['branch'] || user.default_branch_id || 0;
        });
        this.load_members_list();
    };
    MembersPanelPageComponent.prototype.ngOnDestroy = function () {
        this.person_list_sub.unsubscribe();
        this.person_changes_subscriber.unsubscribe();
    };
    MembersPanelPageComponent.prototype.change_view = function (view) {
        if (view == 0) {
            this.router.navigateByUrl("people");
        }
        else if (view == 1) {
            this.router.navigateByUrl("people/members");
        }
    };
    MembersPanelPageComponent.prototype.load_members_list = function () {
        var _this = this;
        if (this.person_list_sub) {
            this.person_list_sub.unsubscribe();
        }
        this.person_list_sub = this.personService.getMembersList().subscribe(function (data) {
            var result = data;
            _this.programs = result;
        });
    };
    MembersPanelPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './members-panel-page.component.html',
            styleUrls: ['../people-customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, router_1.ActivatedRoute,
            router_1.Router,
            ng_bootstrap_1.NgbModal, typeof (_c = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _c || Object, ng_bootstrap_1.NgbDatepickerConfig])
    ], MembersPanelPageComponent);
    return MembersPanelPageComponent;
    var _a, _b, _c;
}());
exports.MembersPanelPageComponent = MembersPanelPageComponent;
//# sourceMappingURL=members-panel-page.component.js.map