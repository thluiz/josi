"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var agenda_page_component_1 = require("./agenda-page/agenda-page.component");
var weekly_page_component_1 = require("./weekly-page/weekly-page.component");
var daily_page_component_1 = require("./daily-page/daily-page.component");
var current_activities_page_component_1 = require("app/pages/diary/current-activities-page/current-activities-page.component");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var routes = [
    {
        path: '',
        component: agenda_page_component_1.AgendaPageComponent,
    },
    {
        path: 'week',
        component: weekly_page_component_1.WeeklyPageComponent,
    },
    {
        path: 'day',
        component: daily_page_component_1.DailyPageComponent,
    },
    {
        path: 'agenda',
        component: agenda_page_component_1.AgendaPageComponent,
    },
    {
        path: 'current_activities',
        component: current_activities_page_component_1.CurrentActivitiesPageComponent,
    }
];
var DiaryRoutingModule = /** @class */ (function () {
    function DiaryRoutingModule() {
    }
    DiaryRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule],
        })
    ], DiaryRoutingModule);
    return DiaryRoutingModule;
}());
exports.DiaryRoutingModule = DiaryRoutingModule;
//# sourceMappingURL=diary-routing.module.js.map