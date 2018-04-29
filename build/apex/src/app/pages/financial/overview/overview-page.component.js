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
var modal_service_1 = require("app/services/modal-service");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var financial_service_1 = require("app/services/financial-service");
var security_service_1 = require("app/services/security-service");
var Observable_1 = require("rxjs/Observable");
var PROJECT_BAG_NAME = 'childrens';
var OverviewPageComponent = /** @class */ (function () {
    function OverviewPageComponent(financialService, securityService, modalService, parameterService, route, router) {
        this.financialService = financialService;
        this.securityService = securityService;
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.route = route;
        this.router = router;
        this.account_data = [];
    }
    OverviewPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        Observable_1.Observable.zip(this.parameterService.getActiveBranches(), this.securityService.getCurrentUserData(), this.route.params, function (branches, user, params) {
            _this.branches = branches;
            _this.branch_id = user.default_branch_id || +params['branch_id'];
            _this.load_data();
        }).subscribe();
    };
    OverviewPageComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    OverviewPageComponent.prototype.change_branch = function () {
        this.router.navigateByUrl("financial/" + this.branch_id);
        this.account_data = null;
        this.account_data = [];
        this.load_data();
    };
    OverviewPageComponent.prototype.load_data = function () {
        var _this = this;
        if (!this.branch_id || this.branch_id <= 0) {
            return;
        }
        this.financialService.getBranchAccounts(this.branch_id).subscribe(function (data) {
            data.forEach(function (account) {
                var account_id = account.id;
                var account_data = { data: account, account_status: null, expected_payments: null, missing_payments: null };
                _this.financialService.getAccountStatus(account_id).subscribe(function (data) {
                    account_data.account_status = data;
                });
                _this.financialService.getExpectedPayments(account_id).subscribe(function (data) {
                    account_data.expected_payments = data;
                });
                _this.financialService.getMissingPayments(account_id).subscribe(function (data) {
                    account_data.missing_payments = data;
                });
                _this.account_data[_this.account_data.length] = account_data;
            });
        });
    };
    OverviewPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './overview-page.component.html',
            styleUrls: ['../financial-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof financial_service_1.FinancialService !== "undefined" && financial_service_1.FinancialService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, typeof (_c = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _c || Object, typeof (_d = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _d || Object, router_1.ActivatedRoute,
            router_1.Router])
    ], OverviewPageComponent);
    return OverviewPageComponent;
    var _a, _b, _c, _d;
}());
exports.OverviewPageComponent = OverviewPageComponent;
//# sourceMappingURL=overview-page.component.js.map