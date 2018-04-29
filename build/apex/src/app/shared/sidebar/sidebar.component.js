"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var security_service_1 = require("./../../services/security-service");
var core_1 = require("@angular/core");
var sidebar_routes_config_1 = require("./sidebar-routes.config");
var router_1 = require("@angular/router");
var environment_1 = require("../../../environments/environment");
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(router, route, securityService) {
        this.router = router;
        this.route = route;
        this.securityService = securityService;
        this.logout_url = environment_1.environment.logout_url;
    }
    SidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        $.getScript('./assets/js/app-sidebar.js');
        this.menuItems = sidebar_routes_config_1.ROUTES;
        this.securityService.getCurrentUserData().subscribe(function (data) {
            _this.current_user = data;
        });
    };
    SidebarComponent = __decorate([
        core_1.Component({
            // moduleId: module.id,
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
        }),
        __metadata("design:paramtypes", [router_1.Router,
            router_1.ActivatedRoute,
            security_service_1.SecurityService])
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
//# sourceMappingURL=sidebar.component.js.map