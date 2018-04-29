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
var Display;
(function (Display) {
    Display[Display["Members"] = 0] = "Members";
    Display[Display["Management"] = 1] = "Management";
})(Display || (Display = {}));
var ChangeMembersViewComponent = /** @class */ (function () {
    function ChangeMembersViewComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    ChangeMembersViewComponent.prototype.ngOnInit = function () {
        if (this.initial_display == "members") {
            this.display = Display.Members;
        }
        else if (this.initial_display == "management") {
            this.display = Display.Management;
        }
    };
    ChangeMembersViewComponent.prototype.change_view = function (display) {
        console.log(display);
        switch (display) {
            case "0":
                this.router.navigateByUrl("people/members");
                break;
            case "1":
                this.router.navigateByUrl("people/members/management");
                break;
        }
    };
    __decorate([
        core_1.Input("display"),
        __metadata("design:type", String)
    ], ChangeMembersViewComponent.prototype, "initial_display", void 0);
    ChangeMembersViewComponent = __decorate([
        core_1.Component({
            selector: 'people-change-members-view',
            templateUrl: './change-members-view.component.html'
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router])
    ], ChangeMembersViewComponent);
    return ChangeMembersViewComponent;
}());
exports.ChangeMembersViewComponent = ChangeMembersViewComponent;
//# sourceMappingURL=change-members-view.component.js.map