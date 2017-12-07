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
const daily_pages_routing_module_1 = require("./daily-pages-routing.module");
const daily_page_component_1 = require("./daily-page.component");
const forms_1 = require("@angular/forms");
let DailyPagesModule = class DailyPagesModule {
};
DailyPagesModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            daily_pages_routing_module_1.DailyPagesRoutingModule,
            forms_1.FormsModule
        ],
        declarations: [
            daily_page_component_1.DailyPageComponent
        ]
    })
], DailyPagesModule);
exports.DailyPagesModule = DailyPagesModule;
//# sourceMappingURL=daily-pages.module.js.map