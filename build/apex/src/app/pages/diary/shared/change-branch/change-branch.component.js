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
var parameter_service_1 = require("app/services/parameter-service");
var core_1 = require("@angular/core");
var DiaryChangeBranchComponent = /** @class */ (function () {
    function DiaryChangeBranchComponent(parameterService) {
        this.parameterService = parameterService;
        this.current_branch = 0;
        this.change_branch = new core_1.EventEmitter();
        this.branches = [];
    }
    DiaryChangeBranchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.parameterService.getActiveBranches().subscribe(function (data) {
            _this.branches = data;
        });
        if (!this.current_branch) {
            this.current_branch = 0;
        }
    };
    DiaryChangeBranchComponent.prototype.branchSelected = function () {
        this.change_branch.emit(this.current_branch);
    };
    __decorate([
        core_1.Input("branch"),
        __metadata("design:type", Object)
    ], DiaryChangeBranchComponent.prototype, "current_branch", void 0);
    __decorate([
        core_1.Output("onChangeBranch"),
        __metadata("design:type", Object)
    ], DiaryChangeBranchComponent.prototype, "change_branch", void 0);
    DiaryChangeBranchComponent = __decorate([
        core_1.Component({
            selector: 'diary-change-branch',
            templateUrl: './change-branch.component.html'
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object])
    ], DiaryChangeBranchComponent);
    return DiaryChangeBranchComponent;
    var _a;
}());
exports.DiaryChangeBranchComponent = DiaryChangeBranchComponent;
//# sourceMappingURL=change-branch.component.js.map