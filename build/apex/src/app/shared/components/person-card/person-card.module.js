"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var contact_buttonitem_module_1 = require("../contact-buttonitem/contact-buttonitem.module");
var contact_listitem_module_1 = require("../contact-listitem/contact-listitem.module");
var person_status_line_module_1 = require("./../person-status-line/person-status-line.module");
var router_1 = require("@angular/router");
var person_card_component_1 = require("./person-card.component");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var filter_principal_module_1 = require("app/shared/pipes/filter-principal/filter-principal.module");
var filter_principal_pipe_1 = require("app/shared/pipes/filter-principal/filter-principal.pipe");
var PersonCardModule = /** @class */ (function () {
    function PersonCardModule() {
    }
    PersonCardModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule,
                person_status_line_module_1.PersonStatusLineModule,
                contact_listitem_module_1.ContactListitemModule,
                contact_buttonitem_module_1.ContactButtonitemModule,
                filter_principal_module_1.FilterPrincipalPipeModule
            ],
            declarations: [
                person_card_component_1.PersonCardComponent, filter_principal_pipe_1.FilterPrincipalPipe
            ], exports: [
                person_card_component_1.PersonCardComponent
            ]
        })
    ], PersonCardModule);
    return PersonCardModule;
}());
exports.PersonCardModule = PersonCardModule;
//# sourceMappingURL=person-card.module.js.map