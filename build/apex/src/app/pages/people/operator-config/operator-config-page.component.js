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
var card_service_1 = require("app/services/card-service");
var router_1 = require("@angular/router");
var OperatorConfigPageComponent = /** @class */ (function () {
    function OperatorConfigPageComponent(cardService, route, router) {
        this.cardService = cardService;
        this.route = route;
        this.router = router;
    }
    OperatorConfigPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = +params['id'];
        });
    };
    OperatorConfigPageComponent.prototype.ngOnDestroy = function () {
    };
    OperatorConfigPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './operator-config-page.component.html',
            styleUrls: ['../people-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _a || Object, router_1.ActivatedRoute,
            router_1.Router])
    ], OperatorConfigPageComponent);
    return OperatorConfigPageComponent;
    var _a;
}());
exports.OperatorConfigPageComponent = OperatorConfigPageComponent;
//# sourceMappingURL=operator-config-page.component.js.map