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
var parameter_service_1 = require("./../../../services/parameter-service");
var modal_service_1 = require("app/services/modal-service");
var core_1 = require("@angular/core");
var person_service_1 = require("app/services/person-service");
var router_1 = require("@angular/router");
var security_service_1 = require("app/services/security-service");
var InterestedPanelPageComponent = /** @class */ (function () {
    function InterestedPanelPageComponent(personService, securityService, activatedRoute, router, parameterService, modalService) {
        this.personService = personService;
        this.securityService = securityService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.parameterService = parameterService;
        this.modalService = modalService;
        this.current_view = 0;
        this.filters = "1";
        this.current_branch = 0;
        this.search_name = "";
    }
    InterestedPanelPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.search_name = this.activatedRoute.snapshot.queryParams["name"] || "";
        this.parameterService.getActiveBranches().subscribe(function (branches) {
            _this.branches = branches;
        });
        this.securityService.getCurrentUserData().subscribe(function (user) {
            _this.current_branch = _this.activatedRoute.snapshot.queryParams["branch"] || user.default_branch_id || 0;
            _this.load_interested_list();
        });
        this.interested_added_subscriber = this.personService.personActions$
            .filter(function (p) { return p.data != null && p.data.is_interested && (!_this.current_branch || p.data.branch_id == _this.current_branch); })
            .subscribe(function (next) {
            _this.load_interested_list();
        });
    };
    InterestedPanelPageComponent.prototype.ngOnDestroy = function () {
        if (this.person_list_sub) {
            this.person_list_sub.unsubscribe();
        }
    };
    InterestedPanelPageComponent.prototype.apply_filters = function () {
        var _this = this;
        var people = this.all_people;
        if (this.current_branch > 0) {
            people = people.filter(function (p) {
                return p.branch_id == _this.current_branch;
            });
        }
        this.people = people;
    };
    InterestedPanelPageComponent.prototype.filter_people = function () {
        this.router.navigateByUrl("people/interested?branch=" + this.current_branch + "&name=" + this.search_name);
        this.load_interested_list();
    };
    InterestedPanelPageComponent.prototype.keyDownFunction = function (event) {
        if (event.keyCode == 13) {
            this.filter_people();
        }
    };
    InterestedPanelPageComponent.prototype.open_new_person_modal = function () {
        this.modalService.open(modal_service_1.ModalType.AddPerson, null);
    };
    InterestedPanelPageComponent.prototype.load_interested_list = function () {
        var _this = this;
        if (this.person_list_sub) {
            this.person_list_sub.unsubscribe();
        }
        this.person_list_sub = this.personService.getInterestedList(this.current_branch, this.search_name).subscribe(function (data) {
            _this.all_people = data;
            _this.apply_filters();
        });
    };
    InterestedPanelPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './interested-panel-page.component.html',
            styleUrls: ['../people-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, router_1.ActivatedRoute,
            router_1.Router,
            parameter_service_1.ParameterService, typeof (_c = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _c || Object])
    ], InterestedPanelPageComponent);
    return InterestedPanelPageComponent;
    var _a, _b, _c;
}());
exports.InterestedPanelPageComponent = InterestedPanelPageComponent;
//# sourceMappingURL=interested-panel-page.component.js.map