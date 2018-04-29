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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var card_service_1 = require("app/services/card-service");
var security_service_1 = require("app/services/security-service");
var OperatorPageComponent = /** @class */ (function () {
    function OperatorPageComponent(cardService, securityService, route, router) {
        this.cardService = cardService;
        this.securityService = securityService;
        this.route = route;
        this.router = router;
    }
    OperatorPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            if (params['id'] === "current") {
                _this.securityService.getCurrentUserData().subscribe(function (data) {
                    _this.id = data.person_id;
                });
            }
            else {
                _this.id = +params['id'];
            }
        });
    };
    OperatorPageComponent.prototype.ngOnDestroy = function () {
    };
    OperatorPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './operator-page.component.html',
            styleUrls: ['../people-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, router_1.ActivatedRoute,
            router_1.Router])
    ], OperatorPageComponent);
    return OperatorPageComponent;
    var _a, _b;
}());
exports.OperatorPageComponent = OperatorPageComponent;
//# sourceMappingURL=operator-page.component.js.map