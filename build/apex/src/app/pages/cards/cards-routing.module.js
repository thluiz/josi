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
var organizations_overview_page_component_1 = require("app/pages/cards/organizations-overview-page/organizations-overview-page.component");
var organization_detail_page_component_1 = require("app/pages/cards/organization-detail-page/organization-detail-page.component");
var organization_config_page_component_1 = require("app/pages/cards/organization-config-page/organization-config-page.component");
var project_page_component_1 = require("app/pages/cards/project-page/project-page.component");
var routes = [
    {
        path: '',
        component: organizations_overview_page_component_1.OrganizationsOverviewPageComponent,
        data: {},
    },
    {
        path: 'detail/:id',
        component: organization_detail_page_component_1.OrganizationDetailPageComponent,
        data: {},
    },
    {
        path: 'config/:id',
        component: organization_config_page_component_1.OrganizationConfigPageComponent,
        data: {},
    },
    {
        path: 'projects/:id',
        component: project_page_component_1.ProjectPageComponent,
        data: {},
    }
];
var CardsRoutingModule = /** @class */ (function () {
    function CardsRoutingModule() {
    }
    CardsRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule],
        })
    ], CardsRoutingModule);
    return CardsRoutingModule;
}());
exports.CardsRoutingModule = CardsRoutingModule;
//# sourceMappingURL=cards-routing.module.js.map