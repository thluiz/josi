"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const full_layout_component_1 = require("./layouts/full/full-layout.component");
const content_layout_component_1 = require("./layouts/content/content-layout.component");
const full_layout_routes_1 = require("./shared/routes/full-layout.routes");
const content_layout_routes_1 = require("./shared/routes/content-layout.routes");
const auth_guard_service_1 = require("./shared/auth/auth-guard.service");
const appRoutes = [
    {
        path: '',
        redirectTo: 'daily',
        pathMatch: 'full',
    },
    { path: '', component: full_layout_component_1.FullLayoutComponent, data: { title: 'full Views' }, children: full_layout_routes_1.Full_ROUTES, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: '', component: content_layout_component_1.ContentLayoutComponent, data: { title: 'content Views' }, children: content_layout_routes_1.CONTENT_ROUTES, canActivate: [auth_guard_service_1.AuthGuard] },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(appRoutes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map