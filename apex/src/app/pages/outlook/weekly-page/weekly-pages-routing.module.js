"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const daily_page_component_1 = require("app/pages/daily-page/daily-page.component");
const routes = [
    {
        path: '',
        component: daily_page_component_1.DailyPageComponent,
        data: {
            title: 'Diário de Atividades'
        },
    }
];
let DailyPagesRoutingModule = class DailyPagesRoutingModule {
};
DailyPagesRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule],
    })
], DailyPagesRoutingModule);
exports.DailyPagesRoutingModule = DailyPagesRoutingModule;
//# sourceMappingURL=daily-pages-routing.module.js.map