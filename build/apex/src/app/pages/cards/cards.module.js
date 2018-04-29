"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cards_routing_module_1 = require("./cards-routing.module");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var ng2_dragula_1 = require("ng2-dragula");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_markdown_1 = require("ngx-markdown");
var diary_header_module_1 = require("app/pages/diary/shared/diary-header/diary-header.module");
var organization_card_module_1 = require("app/pages/cards/shared/organization-card/organization-card.module");
var compact_card_module_1 = require("app/pages/cards/shared/compact-card/compact-card.module");
var operator_card_module_1 = require("app/shared/components/operator-card/operator-card.module");
var organizations_overview_page_component_1 = require("./organizations-overview-page/organizations-overview-page.component");
var organization_detail_page_component_1 = require("app/pages/cards/organization-detail-page/organization-detail-page.component");
var organization_config_page_component_1 = require("app/pages/cards/organization-config-page/organization-config-page.component");
var project_page_component_1 = require("app/pages/cards/project-page/project-page.component");
var CardsModule = /** @class */ (function () {
    function CardsModule() {
    }
    CardsModule = __decorate([
        core_1.NgModule({
            imports: [
                cards_routing_module_1.CardsRoutingModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbModule,
                ng_bootstrap_1.NgbDatepickerModule.forRoot(),
                ng_bootstrap_1.NgbTimepickerModule.forRoot(),
                ngx_markdown_1.MarkdownModule.forRoot(),
                diary_header_module_1.DiaryHeaderModule,
                organization_card_module_1.OrganizationCardModule,
                ng2_dragula_1.DragulaModule,
                operator_card_module_1.OperatorCardModule,
                compact_card_module_1.CompactCardModule
            ],
            declarations: [
                organizations_overview_page_component_1.OrganizationsOverviewPageComponent,
                organization_detail_page_component_1.OrganizationDetailPageComponent,
                organization_config_page_component_1.OrganizationConfigPageComponent,
                project_page_component_1.ProjectPageComponent
            ]
        })
    ], CardsModule);
    return CardsModule;
}());
exports.CardsModule = CardsModule;
//# sourceMappingURL=cards.module.js.map