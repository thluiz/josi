"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var organization_card_component_1 = require("./organization-card.component");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var operator_card_module_1 = require("app/shared/components/operator-card/operator-card.module");
var leadered_projects_pipe_1 = require("app/pages/cards/shared/leadered-projects.pipe");
var compact_card_module_1 = require("app/pages/cards/shared/compact-card/compact-card.module");
var OrganizationCardModule = /** @class */ (function () {
    function OrganizationCardModule() {
    }
    OrganizationCardModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule,
                operator_card_module_1.OperatorCardModule,
                compact_card_module_1.CompactCardModule
            ],
            declarations: [
                organization_card_component_1.OrganizationCardComponent, leadered_projects_pipe_1.LeaderedProjectsPipe
            ], exports: [
                organization_card_component_1.OrganizationCardComponent
            ]
        })
    ], OrganizationCardModule);
    return OrganizationCardModule;
}());
exports.OrganizationCardModule = OrganizationCardModule;
//# sourceMappingURL=organization-card.module.js.map