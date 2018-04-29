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
var forms_1 = require("@angular/forms");
var content_pages_routing_module_1 = require("./content-pages-routing.module");
var content_layout_page_component_1 = require("./content-layout-page.component");
var ContentPagesModule = /** @class */ (function () {
    function ContentPagesModule() {
    }
    ContentPagesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                content_pages_routing_module_1.ContentPagesRoutingModule,
                forms_1.FormsModule
            ],
            declarations: [
                content_layout_page_component_1.ContentLayoutPageComponent
            ]
        })
    ], ContentPagesModule);
    return ContentPagesModule;
}());
exports.ContentPagesModule = ContentPagesModule;
//# sourceMappingURL=content-pages.module.js.map