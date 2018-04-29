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
var Panels;
(function (Panels) {
    Panels[Panels["Members"] = 0] = "Members";
    Panels[Panels["Interested"] = 1] = "Interested";
    Panels[Panels["Away"] = 2] = "Away";
    Panels[Panels["ServiceProvider"] = 3] = "ServiceProvider";
    Panels[Panels["Voucher"] = 4] = "Voucher";
})(Panels || (Panels = {}));
var PeopleHeaderComponent = /** @class */ (function () {
    function PeopleHeaderComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    PeopleHeaderComponent.prototype.ngOnInit = function () {
        if (this.initial_panel == "members") {
            this.current_panel = Panels.Members;
        }
        else if (this.initial_panel == "away") {
            this.current_panel = Panels.Away;
        }
        else if (this.initial_panel == "interested") {
            this.current_panel = Panels.Interested;
        }
        else if (this.initial_panel == "service_providers") {
            this.current_panel = Panels.ServiceProvider;
        }
        else if (this.initial_panel == "voucher") {
            this.current_panel = Panels.Voucher;
        }
    };
    PeopleHeaderComponent.prototype.change_display = function (panel) {
        switch (panel.toString()) {
            case Panels.Members.toString():
                this.router.navigateByUrl("people/members");
                break;
            case Panels.Away.toString():
                this.router.navigateByUrl("people/away");
                break;
            case Panels.Interested.toString():
                this.router.navigateByUrl("people/interested");
                break;
            case Panels.ServiceProvider.toString():
                this.router.navigateByUrl("people/service_provider");
                break;
            case Panels.Voucher.toString():
                this.router.navigateByUrl("people/voucher");
                break;
        }
    };
    __decorate([
        core_1.Input("panel"),
        __metadata("design:type", String)
    ], PeopleHeaderComponent.prototype, "initial_panel", void 0);
    PeopleHeaderComponent = __decorate([
        core_1.Component({
            selector: 'people-header',
            templateUrl: './people-header.component.html'
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router])
    ], PeopleHeaderComponent);
    return PeopleHeaderComponent;
}());
exports.PeopleHeaderComponent = PeopleHeaderComponent;
//# sourceMappingURL=people-header.component.js.map