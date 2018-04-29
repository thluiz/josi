"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var person_card_module_1 = require("./../../../../shared/components/person-card/person-card.module");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var compact_card_component_1 = require("./compact-card.component");
var CompactCardModule = /** @class */ (function () {
    function CompactCardModule() {
    }
    CompactCardModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule,
                person_card_module_1.PersonCardModule
            ],
            declarations: [
                compact_card_component_1.CompactCardComponent
            ], exports: [
                compact_card_component_1.CompactCardComponent
            ]
        })
    ], CompactCardModule);
    return CompactCardModule;
}());
exports.CompactCardModule = CompactCardModule;
//# sourceMappingURL=compact-card.module.js.map