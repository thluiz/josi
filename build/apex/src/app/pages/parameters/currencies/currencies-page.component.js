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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var core_1 = require("@angular/core");
var parameter_service_1 = require("app/services/parameter-service");
var CurrenciesPageComponent = /** @class */ (function () {
    function CurrenciesPageComponent(parameterService, ngbModalService) {
        this.parameterService = parameterService;
        this.ngbModalService = ngbModalService;
        this.saving = false;
    }
    CurrenciesPageComponent.prototype.ngOnInit = function () {
        this.load_data();
    };
    CurrenciesPageComponent.prototype.load_data = function () {
        var _this = this;
        this.parameterService.getCurrencies().subscribe(function (data) {
            _this.collection = data;
        });
    };
    CurrenciesPageComponent.prototype.save = function (close_action) {
        var _this = this;
        this.saving = true;
        this.parameterService.saveCurrency(this.current_item).subscribe(function (data) {
            if (close_action) {
                close_action();
            }
            _this.saving = false;
            _this.load_data();
        });
    };
    CurrenciesPageComponent.prototype.create = function (content) {
        var col = this.collection;
        var suggested_order = col.length > 0 ? col[col.length - 1].order + 1 : 0;
        this.current_item = {
            id: 0,
            name: "",
            order: suggested_order
        };
        this.open_modal(content);
    };
    CurrenciesPageComponent.prototype.edit = function (content, item) {
        this.current_item = item;
        this.open_modal(content);
    };
    CurrenciesPageComponent.prototype.open_modal = function (content) {
        var _this = this;
        this.ngbModalService.open(content).result.then(function (result) {
        }, function (reason) {
            _this.current_item = null;
            console.log(reason);
        });
    };
    CurrenciesPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './currencies-page.component.html',
            styleUrls: ['../parameters-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object, ng_bootstrap_1.NgbModal])
    ], CurrenciesPageComponent);
    return CurrenciesPageComponent;
    var _a;
}());
exports.CurrenciesPageComponent = CurrenciesPageComponent;
//# sourceMappingURL=currencies-page.component.js.map