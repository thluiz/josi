"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var person_status_line_module_1 = require("./../person-status-line/person-status-line.module");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var incident_financial_listitem_component_1 = require("./incident-financial-listitem.component");
var IncidentFinancialListitemModule = /** @class */ (function () {
    function IncidentFinancialListitemModule() {
    }
    IncidentFinancialListitemModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                person_status_line_module_1.PersonStatusLineModule
            ],
            declarations: [
                incident_financial_listitem_component_1.IncidentFinancialListitemComponent
            ], exports: [
                incident_financial_listitem_component_1.IncidentFinancialListitemComponent
            ]
        })
    ], IncidentFinancialListitemModule);
    return IncidentFinancialListitemModule;
}());
exports.IncidentFinancialListitemModule = IncidentFinancialListitemModule;
//# sourceMappingURL=incident-financial-listitem.module.js.map