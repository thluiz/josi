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
var parameter_service_1 = require("app/services/parameter-service");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var ProductsPageComponent = /** @class */ (function () {
    function ProductsPageComponent(parameterService, ngbModalService) {
        this.parameterService = parameterService;
        this.ngbModalService = ngbModalService;
        this.saving = false;
    }
    ProductsPageComponent.prototype.ngOnInit = function () {
        this.load_data();
    };
    ProductsPageComponent.prototype.create = function (content) {
        this.current_item = {
            id: 0,
            name: ""
        };
        this.open_modal(content);
    };
    ProductsPageComponent.prototype.load_data = function () {
        var _this = this;
        Observable_1.Observable.zip(this.parameterService.getProductCategories(), this.parameterService.getProducts(true), this.parameterService.getCurrencies(), function (product_category, product, currencies) {
            _this.currencies = currencies;
            var collection = product_category;
            product_category.forEach(function (pc) {
                pc.items = product.filter(function (p) { return p.category_id == pc.id; });
            });
            _this.collection = collection;
        }).subscribe();
    };
    ProductsPageComponent.prototype.save = function (close_action) {
        var _this = this;
        this.saving = true;
        this.parameterService.saveProduct(this.current_item)
            .delay(500)
            .subscribe(function (data) {
            if (close_action) {
                close_action();
            }
            _this.saving = false;
            _this.load_data();
        });
    };
    ProductsPageComponent.prototype.archive_product = function (product) {
        var _this = this;
        this.saving = true;
        this.parameterService.archiveProduct(product)
            .delay(500)
            .subscribe(function (data) {
            _this.saving = false;
            _this.load_data();
        });
    };
    ProductsPageComponent.prototype.edit = function (content, item) {
        this.current_item = item;
        this.open_modal(content);
    };
    ProductsPageComponent.prototype.open_modal = function (content) {
        var _this = this;
        this.ngbModalService.open(content).result.then(function (result) {
        }, function (reason) {
            _this.current_item = null;
            console.log(reason);
        });
    };
    ProductsPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './products-page.component.html',
            styleUrls: ['../parameters-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object, ng_bootstrap_1.NgbModal])
    ], ProductsPageComponent);
    return ProductsPageComponent;
    var _a;
}());
exports.ProductsPageComponent = ProductsPageComponent;
//# sourceMappingURL=products-page.component.js.map