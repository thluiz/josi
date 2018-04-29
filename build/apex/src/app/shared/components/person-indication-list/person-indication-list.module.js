"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var person_indication_list_component_1 = require("./person-indication-list.component");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var PersonIndicationListModule = /** @class */ (function () {
    function PersonIndicationListModule() {
    }
    PersonIndicationListModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule
            ],
            declarations: [
                person_indication_list_component_1.PersonIndicationListComponent
            ], exports: [
                person_indication_list_component_1.PersonIndicationListComponent
            ]
        })
    ], PersonIndicationListModule);
    return PersonIndicationListModule;
}());
exports.PersonIndicationListModule = PersonIndicationListModule;
//# sourceMappingURL=person-indication-list.module.js.map