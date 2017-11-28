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
const changelog_component_1 = require("./changelog.component");
const routes = [
    {
        path: '',
        component: changelog_component_1.ChangeLogComponent,
        data: {
            title: 'ChangeLog'
        },
    }
];
let ChangeLogRoutingModule = class ChangeLogRoutingModule {
};
ChangeLogRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule],
    })
], ChangeLogRoutingModule);
exports.ChangeLogRoutingModule = ChangeLogRoutingModule;
//# sourceMappingURL=changelog-routing.module.js.map