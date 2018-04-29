"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var financial_routing_module_1 = require("./financial-routing.module");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var ng2_dragula_1 = require("ng2-dragula");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_markdown_1 = require("ngx-markdown");
var overview_page_component_1 = require("app/pages/financial/overview/overview-page.component");
var incident_financial_listitem_module_1 = require("app/shared/components/incident-financial-listitem/incident-financial-listitem.module");
var FinancialModule = /** @class */ (function () {
    function FinancialModule() {
    }
    FinancialModule = __decorate([
        core_1.NgModule({
            imports: [
                financial_routing_module_1.FinancialRoutingModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbModule,
                ng_bootstrap_1.NgbDatepickerModule.forRoot(),
                ng_bootstrap_1.NgbTimepickerModule.forRoot(),
                ngx_markdown_1.MarkdownModule.forRoot(),
                ng2_dragula_1.DragulaModule,
                incident_financial_listitem_module_1.IncidentFinancialListitemModule
            ],
            declarations: [
                overview_page_component_1.OverviewPageComponent
            ]
        })
    ], FinancialModule);
    return FinancialModule;
}());
exports.FinancialModule = FinancialModule;
//# sourceMappingURL=financial.module.js.map