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
var OrganizationDetailPageComponent = /** @class */ (function () {
    function OrganizationDetailPageComponent(cardService, route, router) {
        this.cardService = cardService;
        this.route = route;
        this.router = router;
    }
    OrganizationDetailPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = +params['id'];
            _this.cardService.getOrganization(_this.id, true).subscribe(function (data) {
                _this.organization = data;
            });
        });
    };
    OrganizationDetailPageComponent.prototype.ngOnDestroy = function () {
    };
    OrganizationDetailPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './organization-detail-page.component.html',
            styleUrls: ['../cards-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _a || Object, router_1.ActivatedRoute,
            router_1.Router])
    ], OrganizationDetailPageComponent);
    return OrganizationDetailPageComponent;
    var _a;
}());
exports.OrganizationDetailPageComponent = OrganizationDetailPageComponent;
//# sourceMappingURL=organization-detail-page.component.js.map