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
var person_service_1 = require("app/services/person-service");
var DiaryChangeViewComponent = /** @class */ (function () {
    function DiaryChangeViewComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    DiaryChangeViewComponent.prototype.ngOnInit = function () {
        if (this.initial_display == "day") {
            this.display = person_service_1.DailyMonitorDisplayType.Day;
        }
        else if (this.initial_display == "week") {
            this.display = person_service_1.DailyMonitorDisplayType.Week;
        }
        else if (this.initial_display == "agenda") {
            this.display = person_service_1.DailyMonitorDisplayType.Agenda;
        }
        else if (this.initial_display == "current") {
            this.display = person_service_1.DailyMonitorDisplayType.Current;
        }
    };
    DiaryChangeViewComponent.prototype.change_display = function (display) {
        if (display == person_service_1.DailyMonitorDisplayType.Week) {
            this.router.navigateByUrl("diary/week");
        }
        else if (display == person_service_1.DailyMonitorDisplayType.Day) {
            this.router.navigateByUrl("diary/day");
        }
        else if (display == person_service_1.DailyMonitorDisplayType.Agenda) {
            this.router.navigateByUrl("diary/agenda");
        }
        else if (display == person_service_1.DailyMonitorDisplayType.Current) {
            this.router.navigateByUrl("diary/current_activities");
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DiaryChangeViewComponent.prototype, "initial_display", void 0);
    DiaryChangeViewComponent = __decorate([
        core_1.Component({
            selector: 'diary-change-view',
            templateUrl: './change-view.component.html'
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router])
    ], DiaryChangeViewComponent);
    return DiaryChangeViewComponent;
}());
exports.DiaryChangeViewComponent = DiaryChangeViewComponent;
//# sourceMappingURL=change-view.component.js.map