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
var security_service_1 = require("app/services/security-service");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var environment_1 = require("../../../environments/environment");
var DefaultRouteComponent = /** @class */ (function () {
    function DefaultRouteComponent(securityService, router) {
        this.securityService = securityService;
        this.router = router;
    }
    DefaultRouteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.securityService.getCurrentUserData().subscribe(function (user) {
            if (user) {
                _this.router.navigateByUrl(user.default_page_url || '/diary');
            }
            else {
                window.location.href = environment_1.environment.login_url;
            }
        });
    };
    DefaultRouteComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './default-route.component.html',
            styleUrls: ['./default-route.component.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _a || Object, router_1.Router])
    ], DefaultRouteComponent);
    return DefaultRouteComponent;
    var _a;
}());
exports.DefaultRouteComponent = DefaultRouteComponent;
//# sourceMappingURL=default-route.component.js.map