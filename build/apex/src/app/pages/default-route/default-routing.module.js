"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var default_route_component_1 = require("app/pages/default-route/default-route.component");
var routes = [
    {
        path: '',
        component: default_route_component_1.DefaultRouteComponent,
    },
    {
        path: '**',
        component: default_route_component_1.DefaultRouteComponent,
    }
];
var DefaultRouteRoutingModule = /** @class */ (function () {
    function DefaultRouteRoutingModule() {
    }
    DefaultRouteRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule],
        })
    ], DefaultRouteRoutingModule);
    return DefaultRouteRoutingModule;
}());
exports.DefaultRouteRoutingModule = DefaultRouteRoutingModule;
//# sourceMappingURL=default-routing.module.js.map