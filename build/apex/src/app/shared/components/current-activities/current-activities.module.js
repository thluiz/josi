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
var current_activities_component_1 = require("./current-activities.component");
var incident_agenda_listitem_module_1 = require("app/shared/components/incident-agenda-listitem/incident-agenda-listitem.module");
var CurrentActivitiesModule = /** @class */ (function () {
    function CurrentActivitiesModule() {
    }
    CurrentActivitiesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                incident_agenda_listitem_module_1.IncidentAgendaListitemModule
            ],
            declarations: [
                current_activities_component_1.CurrentActivitiesComponent
            ], exports: [
                current_activities_component_1.CurrentActivitiesComponent
            ]
        })
    ], CurrentActivitiesModule);
    return CurrentActivitiesModule;
}());
exports.CurrentActivitiesModule = CurrentActivitiesModule;
//# sourceMappingURL=current-activities.module.js.map