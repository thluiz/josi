"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var parameters_routing_module_1 = require("app/pages/parameters/parameters-routing.module");
var accounts_page_component_1 = require("app/pages/parameters/accounts/accounts-page.component");
var acquirers_page_component_1 = require("app/pages/parameters/acquirers/acquirers-page.component");
var branch_detail_page_component_1 = require("app/pages/parameters/branch-detail/branch-detail-page.component");
var branches_page_component_1 = require("app/pages/parameters/branches/branches-page.component");
var currencies_page_component_1 = require("app/pages/parameters/currencies/currencies-page.component");
var domains_page_component_1 = require("app/pages/parameters/domains/domains-page.component");
var overview_page_component_1 = require("app/pages/parameters/overview/overview-page.component");
var payment_methods_page_component_1 = require("app/pages/parameters/payment-methods/payment-methods-page.component");
var product_categories_page_component_1 = require("app/pages/parameters/product_categories/product_categories-page.component");
var products_page_component_1 = require("app/pages/parameters/products/products-page.component");
var vouchers_page_component_1 = require("app/pages/parameters/vouchers/vouchers-page.component");
var ParametersModule = /** @class */ (function () {
    function ParametersModule() {
    }
    ParametersModule = __decorate([
        core_1.NgModule({
            imports: [
                parameters_routing_module_1.ParametersRoutingModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbModule,
                router_1.RouterModule,
                ng_bootstrap_1.NgbTimepickerModule.forRoot(),
            ],
            declarations: [
                overview_page_component_1.OverviewPageComponent,
                branches_page_component_1.BranchesPageComponent,
                acquirers_page_component_1.AcquirersPageComponent,
                domains_page_component_1.DomainsPageComponent,
                accounts_page_component_1.AccountsPageComponent,
                payment_methods_page_component_1.PaymentMethodsPageComponent,
                branch_detail_page_component_1.BranchDetailPageComponent,
                products_page_component_1.ProductsPageComponent,
                currencies_page_component_1.CurrenciesPageComponent,
                product_categories_page_component_1.ProductCatergoriesPageComponent,
                vouchers_page_component_1.VouchersPageComponent
            ]
        })
    ], ParametersModule);
    return ParametersModule;
}());
exports.ParametersModule = ParametersModule;
//# sourceMappingURL=parameters.module.js.map