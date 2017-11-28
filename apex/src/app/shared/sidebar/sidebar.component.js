"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const sidebar_routes_config_1 = require("./sidebar-routes.config");
let SidebarComponent = class SidebarComponent {
    constructor(router, route) {
        this.router = router;
        this.route = route;
    }
    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');
        this.menuItems = sidebar_routes_config_1.ROUTES.filter(menuItem => menuItem);
    }
};
SidebarComponent = __decorate([
    core_1.Component({
        // moduleId: module.id,
        selector: 'app-sidebar',
        templateUrl: './sidebar.component.html',
    })
], SidebarComponent);
exports.SidebarComponent = SidebarComponent;
//# sourceMappingURL=sidebar.component.js.map