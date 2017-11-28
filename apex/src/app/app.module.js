"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const animations_1 = require("@angular/platform-browser/animations");
const app_routing_module_1 = require("./app-routing.module");
const shared_module_1 = require("./shared/shared.module");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const app_component_1 = require("./app.component");
const content_layout_component_1 = require("./layouts/content/content-layout.component");
const full_layout_component_1 = require("./layouts/full/full-layout.component");
const auth_service_1 = require("./shared/auth/auth.service");
const auth_guard_service_1 = require("./shared/auth/auth-guard.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            full_layout_component_1.FullLayoutComponent,
            content_layout_component_1.ContentLayoutComponent
        ],
        imports: [
            animations_1.BrowserAnimationsModule,
            app_routing_module_1.AppRoutingModule,
            shared_module_1.SharedModule,
            ng_bootstrap_1.NgbModule.forRoot()
        ],
        providers: [
            auth_service_1.AuthService,
            auth_guard_service_1.AuthGuard
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map