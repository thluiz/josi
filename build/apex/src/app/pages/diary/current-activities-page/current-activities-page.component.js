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
var parameter_service_1 = require("app/services/parameter-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var CurrentActivitiesPageComponent = /** @class */ (function () {
    function CurrentActivitiesPageComponent(parameterService, modalService) {
        this.parameterService = parameterService;
        this.modalService = modalService;
        this.current_branch = 0;
        this.current_branch_name = "Todos os Núcleos";
    }
    CurrentActivitiesPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.parameterService.getActiveBranches().subscribe(function (data) {
            _this.branches = data;
        });
    };
    CurrentActivitiesPageComponent.prototype.ngOnDestroy = function () {
    };
    CurrentActivitiesPageComponent.prototype.branchSelected = function (id) {
        var _this = this;
        this.show_change_branch = false;
        if (this.current_branch == 0) {
            this.current_branch_name = "Todos os Núcleos";
            return;
        }
        var current = this.branches.find(function (b) { return b.id == _this.current_branch; });
        this.current_branch_name = current.name;
    };
    CurrentActivitiesPageComponent.prototype.open = function (content, incident) {
        var _this = this;
        this.current_incident = incident;
        this.modalService.open(content).result.then(function (result) {
            _this.current_incident = null;
        }, function (reason) {
            console.log(reason);
        });
    };
    CurrentActivitiesPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './current-activities-page.component.html',
            styleUrls: ['../diary.component.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object, ng_bootstrap_1.NgbModal])
    ], CurrentActivitiesPageComponent);
    return CurrentActivitiesPageComponent;
    var _a;
}());
exports.CurrentActivitiesPageComponent = CurrentActivitiesPageComponent;
//# sourceMappingURL=current-activities-page.component.js.map