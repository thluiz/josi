"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var operator_config_page_component_1 = require("./operator-config/operator-config-page.component");
var operator_page_component_1 = require("./operator/operator-page.component");
var people_service_provider_page_component_1 = require("./people-service-provider/people-service-provider-page.component");
var interested_panel_page_component_1 = require("./interested/interested-panel-page.component");
var people_away_panel_page_component_1 = require("./people-away/people-away-panel-page.component");
var members_panel_page_component_1 = require("./members-panel/members-panel-page.component");
var management_panel_page_component_1 = require("./management-panel/management-panel-page.component");
var person_page_component_1 = require("./person/person-page.component");
var person_edit_page_component_1 = require("./edit/person-edit-page.component");
var voucher_people_page_component_1 = require("./voucher/voucher-people-page.component");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var routes = [
    {
        path: 'members/management/:branch/:filter',
        component: management_panel_page_component_1.ManagementPanelPageComponent,
        data: {
            title: 'Painel de Gerência de Membros'
        },
    },
    {
        path: 'members/management',
        component: management_panel_page_component_1.ManagementPanelPageComponent,
        data: {
            title: 'Painel de Gerência de Membros'
        },
    },
    {
        path: 'members',
        component: members_panel_page_component_1.MembersPanelPageComponent,
        data: {
            title: 'Painel de Membros'
        },
    },
    {
        path: 'person/:id',
        component: person_page_component_1.PersonPageComponent,
        data: {
            title: 'Detalhe da Pessoa'
        },
    },
    {
        path: 'person/edit/:id',
        component: person_edit_page_component_1.PersonEditPageComponent,
        data: {
            title: 'Detalhe da Pessoa'
        },
    },
    {
        path: 'operator/:id',
        component: operator_page_component_1.OperatorPageComponent,
    },
    {
        path: 'operator/config/:id',
        component: operator_config_page_component_1.OperatorConfigPageComponent,
    },
    {
        path: 'interested',
        component: interested_panel_page_component_1.InterestedPanelPageComponent,
        data: {},
    },
    {
        path: 'away',
        component: people_away_panel_page_component_1.PeopleAwayPageComponent,
        data: {},
    },
    {
        path: 'service_provider',
        component: people_service_provider_page_component_1.PeopleServiceProviderPageComponent,
        data: {},
    },
    {
        path: 'voucher',
        component: voucher_people_page_component_1.VoucherPeoplePageComponent,
        data: {},
    }
];
var PeopleRoutingModule = /** @class */ (function () {
    function PeopleRoutingModule() {
    }
    PeopleRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule],
        })
    ], PeopleRoutingModule);
    return PeopleRoutingModule;
}());
exports.PeopleRoutingModule = PeopleRoutingModule;
//# sourceMappingURL=people-routing.module.js.map