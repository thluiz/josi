"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var full_pages_routing_module_1 = require("./full-pages-routing.module");
var full_layout_page_component_1 = require("./full-layout-page.component");
var FullPagesModule = /** @class */ (function () {
    function FullPagesModule() {
    }
    FullPagesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                full_pages_routing_module_1.FullPagesRoutingModule
            ],
            declarations: [
                full_layout_page_component_1.FullLayoutPageComponent
            ]
        })
    ], FullPagesModule);
    return FullPagesModule;
}());
exports.FullPagesModule = FullPagesModule;
//# sourceMappingURL=full-pages.module.js.map