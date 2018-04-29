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
var person_service_1 = require("app/services/person-service");
var core_1 = require("@angular/core");
var LateralSummaryComponent = /** @class */ (function () {
    function LateralSummaryComponent(personService) {
        this.personService = personService;
        this.summary = [];
        this.branch = 0;
        this.people_summary_cols = [];
    }
    LateralSummaryComponent.prototype.ngOnInit = function () {
        this.people_summary_cols = [
            { width: "88%", name: "Panorama" },
            { width: "3%", icon: "fa fa-user", description: "Membros" },
            { width: "3", icon: "ft-calendar", description: "Agendamento" },
            { width: "3%", icon: "icon-wallet", description: "Financeiro" },
            { width: "3%", icon: "far fa-envelope", description: "Comunicados" }
        ];
        this.getPeopleSummaryData();
    };
    LateralSummaryComponent.prototype.ngOnDestroy = function () {
        if (this.update_summary_timer) {
            clearTimeout(this.update_summary_timer);
        }
    };
    LateralSummaryComponent.prototype.getPeopleSummaryData = function () {
        var _this = this;
        var current_date = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
        };
        this.personService.getPeopleSummary(this.branch, this.week || 0)
            .subscribe(function (data) {
            var result = data;
            _this.people_summary = result.people_summary;
        }, function (err) { return console.error(err); });
        var d = new Date();
        var hours = d.getHours();
        var update_interval = hours >= 22 || hours < 6 ? 600000 : 300000;
        if (this.update_summary_timer) {
            clearTimeout(this.update_summary_timer);
        }
        this.update_summary_timer = setTimeout(function () { _this.getPeopleSummaryData(); }, update_interval);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LateralSummaryComponent.prototype, "branch", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], LateralSummaryComponent.prototype, "week", void 0);
    LateralSummaryComponent = __decorate([
        core_1.Component({
            selector: 'lateral-summary',
            templateUrl: './lateral-summary.component.html',
            styleUrls: ['./lateral-summary.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object])
    ], LateralSummaryComponent);
    return LateralSummaryComponent;
    var _a;
}());
exports.LateralSummaryComponent = LateralSummaryComponent;
//# sourceMappingURL=lateral-summary.component.js.map