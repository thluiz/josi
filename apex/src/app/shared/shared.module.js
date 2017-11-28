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
const router_1 = require("@angular/router");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const footer_component_1 = require("./footer/footer.component");
const navbar_component_1 = require("./navbar/navbar.component");
const sidebar_component_1 = require("./sidebar/sidebar.component");
const toggle_fullscreen_directive_1 = require("./directives/toggle-fullscreen.directive");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    core_1.NgModule({
        exports: [
            common_1.CommonModule,
            footer_component_1.FooterComponent,
            navbar_component_1.NavbarComponent,
            sidebar_component_1.SidebarComponent,
            toggle_fullscreen_directive_1.ToggleFullscreenDirective,
            ng_bootstrap_1.NgbModule
        ],
        imports: [
            router_1.RouterModule,
            common_1.CommonModule,
            ng_bootstrap_1.NgbModule
        ],
        declarations: [
            footer_component_1.FooterComponent,
            navbar_component_1.NavbarComponent,
            sidebar_component_1.SidebarComponent,
            toggle_fullscreen_directive_1.ToggleFullscreenDirective
        ]
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map