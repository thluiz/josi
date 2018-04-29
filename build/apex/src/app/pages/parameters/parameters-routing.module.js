"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var acquirers_page_component_1 = require("app/pages/parameters/acquirers/acquirers-page.component");
var accounts_page_component_1 = require("app/pages/parameters/accounts/accounts-page.component");
var branches_page_component_1 = require("app/pages/parameters/branches/branches-page.component");
var domains_page_component_1 = require("app/pages/parameters/domains/domains-page.component");
var overview_page_component_1 = require("app/pages/parameters/overview/overview-page.component");
var payment_methods_page_component_1 = require("app/pages/parameters/payment-methods/payment-methods-page.component");
var branch_detail_page_component_1 = require("app/pages/parameters/branch-detail/branch-detail-page.component");
var products_page_component_1 = require("app/pages/parameters/products/products-page.component");
var product_categories_page_component_1 = require("app/pages/parameters/product_categories/product_categories-page.component");
var currencies_page_component_1 = require("app/pages/parameters/currencies/currencies-page.component");
var vouchers_page_component_1 = require("app/pages/parameters/vouchers/vouchers-page.component");
var routes = [
    {
        path: '',
        component: overview_page_component_1.OverviewPageComponent,
        data: {},
    },
    {
        path: 'branches',
        component: branches_page_component_1.BranchesPageComponent,
        data: {},
    },
    {
        path: 'products',
        component: products_page_component_1.ProductsPageComponent,
        data: {},
    },
    {
        path: 'acquirers',
        component: acquirers_page_component_1.AcquirersPageComponent,
        data: {},
    },
    {
        path: 'accounts',
        component: accounts_page_component_1.AccountsPageComponent,
        data: {},
    },
    {
        path: 'domains',
        component: domains_page_component_1.DomainsPageComponent,
        data: {},
    },
    {
        path: 'product_categories',
        component: product_categories_page_component_1.ProductCatergoriesPageComponent,
        data: {},
    },
    {
        path: 'currencies',
        component: currencies_page_component_1.CurrenciesPageComponent,
        data: {},
    },
    {
        path: 'payment-methods',
        component: payment_methods_page_component_1.PaymentMethodsPageComponent,
        data: {},
    },
    {
        path: 'branch/:id',
        component: branch_detail_page_component_1.BranchDetailPageComponent,
        data: {},
    },
    {
        path: 'vouchers',
        component: vouchers_page_component_1.VouchersPageComponent,
        data: {},
    }
];
var ParametersRoutingModule = /** @class */ (function () {
    function ParametersRoutingModule() {
    }
    ParametersRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule],
        })
    ], ParametersRoutingModule);
    return ParametersRoutingModule;
}());
exports.ParametersRoutingModule = ParametersRoutingModule;
//# sourceMappingURL=parameters-routing.module.js.map