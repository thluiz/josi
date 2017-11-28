"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const changelog_routing_module_1 = require("./changelog-routing.module");
const match_height_directive_1 = require("../shared/directives/match-height.directive");
const changelog_component_1 = require("./changelog.component");
let ChangeLogModule = class ChangeLogModule {
};
ChangeLogModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            changelog_routing_module_1.ChangeLogRoutingModule,
            match_height_directive_1.MatchHeightModule
        ],
        exports: [],
        declarations: [changelog_component_1.ChangeLogComponent],
        providers: [],
    })
], ChangeLogModule);
exports.ChangeLogModule = ChangeLogModule;
//# sourceMappingURL=changelog.module.js.map