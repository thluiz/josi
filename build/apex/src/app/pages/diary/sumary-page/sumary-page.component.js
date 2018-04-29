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
var incident_service_1 = require("app/services/incident-service");
var SumaryPageComponent = /** @class */ (function () {
    function SumaryPageComponent(incidentService) {
        this.incidentService = incidentService;
        this.members_sumary_cols = [];
        this.current_week = 0;
        this.current_month = 0;
        this.branches = [];
        this.current_branch_name = "";
        var actual_date = new Date();
        this.current_date = {
            year: actual_date.getFullYear(),
            month: actual_date.getMonth() + 1,
            day: actual_date.getDate()
        };
        this.members_sumary_cols = [
            { width: "88%", name: "Membros" },
            { width: "3%", icon: "fa fa-user", description: "Membros" },
            { width: "3", icon: "ft-calendar", description: "Agendamento" },
            { width: "3%", icon: "icon-wallet", description: "Financeiro" },
            { width: "3%", icon: "far fa-envelope", description: "Comunicados" }
        ];
    }
    SumaryPageComponent.prototype.ngOnInit = function () {
        this.getSummaryData();
    };
    SumaryPageComponent.prototype.ngOnDestroy = function () {
        if (this.update_timer) {
            clearTimeout(this.update_timer);
        }
    };
    SumaryPageComponent.prototype.branchSelected = function (id) {
        if (this.update_timer) {
            clearTimeout(this.update_timer);
            this.update_timer = null;
        }
        this.update_timer = null;
        this.current_branch = id;
        this.getSummaryData();
    };
    SumaryPageComponent.prototype.change_week = function (modifier) {
        if (this.update_timer) {
            clearTimeout(this.update_timer);
            this.update_timer = null;
        }
        this.update_timer = null;
        this.current_week += modifier;
        this.getSummaryData();
    };
    SumaryPageComponent.prototype.change_date = function (new_date) {
        if (this.update_timer) {
            clearTimeout(this.update_timer);
            this.update_timer = null;
        }
        this.update_timer = null;
        this.current_date = new_date;
        this.getSummaryData();
    };
    SumaryPageComponent.prototype.change_month = function (modifier) {
        if (this.update_timer) {
            clearTimeout(this.update_timer);
            this.update_timer = null;
        }
        this.current_month += modifier;
        this.getSummaryData();
    };
    SumaryPageComponent.prototype.getSummaryData = function () {
        var _this = this;
        if (!this.incidentService) {
            return;
        }
        this.incidentService.getSumary(this.current_branch, this.current_month, this.current_week, this.current_date.year + "-" + this.current_date.month + "-" + this.current_date.day)
            .subscribe(function (data) {
            var result = data;
            var sumary = result.sumary;
            _this.current_week_text = result.current_week_text;
            _this.current_month_text = result.current_month_text;
            _this.current_date_text = result.current_date_text;
            _this.members_sumary = result.members_sumary;
            _this.branches = [{ id: 0, name: 'Todos os Núcleos' }].concat(result.branches);
            _this.current_branch_name = (_this.current_branch > 0 ?
                _this.branches.filter(function (b) { return b.id == _this.current_branch; })[0]
                : _this.branches[0]).name;
            for (var k = 0; k < sumary.length; k++) {
                sumary[k].cols = [];
                for (var i = 0; i < sumary[k].activity.length; i++) {
                    for (var z in sumary[k].activity[i]) {
                        sumary[k].cols[sumary[k].cols.length] = sumary[k].activity[i][z];
                    }
                }
            }
            _this.sumary = sumary;
        }, function (err) { return console.error(err); });
        if (this.update_timer) {
            clearTimeout(this.update_timer);
        }
        var update_interval = 600000;
        this.update_timer = setTimeout(function () { _this.getSummaryData(); }, update_interval);
    };
    SumaryPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './sumary-page.component.html',
            providers: [incident_service_1.IncidentService]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _a || Object])
    ], SumaryPageComponent);
    return SumaryPageComponent;
    var _a;
}());
exports.SumaryPageComponent = SumaryPageComponent;
//# sourceMappingURL=sumary-page.component.js.map