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
var utils_service_1 = require("app/services/utils-service");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var Rx_1 = require("rxjs/Rx");
var environment_1 = require("../../environments/environment");
var Configurations;
(function (Configurations) {
    Configurations[Configurations["MinimalIndicationsPerActiveMember"] = 1] = "MinimalIndicationsPerActiveMember";
})(Configurations = exports.Configurations || (exports.Configurations = {}));
var ParameterService = /** @class */ (function () {
    function ParameterService(http, utilsService) {
        this.http = http;
        this.utilsService = utilsService;
        this.dataUrl = environment_1.environment.api_url;
        this.configuration$ = new Rx_1.ReplaySubject(1);
        this.incident_types$ = new Rx_1.ReplaySubject(1);
        this.contact_types$ = new Rx_1.ReplaySubject(1);
        this.recurrence_types$ = new Rx_1.ReplaySubject(1);
        this.kf_families$ = new Rx_1.ReplaySubject(1);
        this.roles$ = new Rx_1.ReplaySubject(1);
        this.branches$ = new Rx_1.ReplaySubject(1);
        this.programs$ = new Rx_1.ReplaySubject(1);
        this.domains$ = new Rx_1.ReplaySubject(1);
        this.locations$ = new Rx_1.ReplaySubject(1);
        this.group$ = new Rx_1.ReplaySubject(1);
        this.countries$ = new Rx_1.ReplaySubject(1);
        this.payment_methods$ = new Rx_1.ReplaySubject(1);
        this.acquirers$ = new Rx_1.ReplaySubject(1);
        this.products$ = new Rx_1.ReplaySubject(1);
        this.currencies$ = new Rx_1.ReplaySubject(1);
        this.product_categories$ = new Rx_1.ReplaySubject(1);
        this.personCardPositions$ = new Rx_1.ReplaySubject(1);
        this.cardTemplates$ = new Rx_1.ReplaySubject(1);
    }
    ParameterService.prototype.getTimeReloadComponents = function () {
        return 200;
    };
    ParameterService.prototype.getConfigurations = function (forceRefresh) {
        return this.utilsService.cache_results(this.configuration$, "/configurations", forceRefresh);
    };
    ParameterService.prototype.getDomains = function (forceRefresh) {
        return this.utilsService.cache_results(this.domains$, "/domains", forceRefresh);
    };
    ParameterService.prototype.getPrograms = function (forceRefresh) {
        return this.utilsService.cache_results(this.programs$, "/programs", forceRefresh);
    };
    ParameterService.prototype.getProducts = function (forceRefresh) {
        return this.utilsService.cache_results(this.products$, "/products", forceRefresh);
    };
    ParameterService.prototype.getActiveBranches = function (forceRefresh) {
        return this.utilsService.cache_results(this.branches$, "/branches", forceRefresh);
    };
    ParameterService.prototype.getBranch = function (id) {
        return this.http.get(this.dataUrl + ("/branches/" + id));
    };
    ParameterService.prototype.getBranchMap = function (branch_id) {
        return this.http.get(this.dataUrl + ("/branch_maps/branch/" + branch_id));
    };
    ParameterService.prototype.getBranchProducts = function (branch_id) {
        return this.http.get(this.dataUrl + ("/branch_products/branch/" + branch_id));
    };
    ParameterService.prototype.getCountries = function (forceRefresh) {
        return this.utilsService.cache_results(this.countries$, "/countries", forceRefresh);
    };
    ParameterService.prototype.getLocations = function (forceRefresh) {
        return this.utilsService.cache_results(this.locations$, "/locations", forceRefresh);
    };
    ParameterService.prototype.getKungFuFamilies = function (forceRefresh) {
        return this.utilsService.cache_results(this.kf_families$, "/kf_families", forceRefresh);
    };
    ParameterService.prototype.getRoles = function (forceRefresh) {
        return this.utilsService.cache_results(this.roles$, "/roles", forceRefresh);
    };
    ParameterService.prototype.getRecurrenceTypes = function (forceRefresh) {
        return this.utilsService.cache_results(this.recurrence_types$, "/recurrence_types", forceRefresh);
    };
    ParameterService.prototype.getIncidentTypes = function (forceRefresh) {
        return this.utilsService.cache_results(this.incident_types$, "/incident_types", forceRefresh);
    };
    ParameterService.prototype.getContactTypes = function (forceRefresh) {
        return this.utilsService.cache_results(this.contact_types$, "/contact_types", forceRefresh);
    };
    ParameterService.prototype.getPersonCardPositions = function (forceRefresh) {
        return this.utilsService.cache_results(this.personCardPositions$, "/person_card_positions", forceRefresh);
    };
    ParameterService.prototype.getCardTemplates = function (forceRefresh) {
        return this.utilsService.cache_results(this.cardTemplates$, "/card_templates", forceRefresh);
    };
    ParameterService.prototype.getGroups = function (forceRefresh) {
        return this.utilsService.cache_results(this.group$, "/groups", forceRefresh);
    };
    ParameterService.prototype.getPaymentMethods = function (forceRefresh) {
        return this.utilsService.cache_results(this.payment_methods$, "/payment_methods", forceRefresh);
    };
    ParameterService.prototype.getAcquirers = function (forceRefresh) {
        return this.utilsService.cache_results(this.acquirers$, "/acquirers", forceRefresh);
    };
    ParameterService.prototype.getCurrencies = function (forceRefresh) {
        return this.utilsService.cache_results(this.currencies$, "/currencies", forceRefresh);
    };
    ParameterService.prototype.getProductCategories = function (forceRefresh) {
        return this.utilsService.cache_results(this.product_categories$, "/product_categories", forceRefresh);
    };
    ParameterService.prototype.getVouchers = function () {
        return this.http.get(this.dataUrl + "/parameters/vouchers");
    };
    ParameterService.prototype.saveBranch = function (branch) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/branches", {
            branch: branch
        }).do(function (data) {
            _this.getActiveBranches(true).subscribe();
        });
    };
    ParameterService.prototype.associateBranchProduct = function (branch_product) {
        return this.http.post(this.dataUrl + "/branch_products", branch_product);
    };
    ParameterService.prototype.saveBranchProduct = function (branch_id, branch_product) {
        return this.http.post(this.dataUrl + ("/branch_products/" + branch_id), branch_product);
    };
    ParameterService.prototype.archiveBranchProduct = function (product) {
        return this.http.post(this.dataUrl + ("/branch_products/archive/" + (product.branch_id || 0)), product);
    };
    ParameterService.prototype.saveBranchMap = function (map) {
        return this.http.post(this.dataUrl + "/branch_maps", map);
    };
    ParameterService.prototype.archiveMap = function (map) {
        return this.http.post(this.dataUrl + "/branch_maps/archive", map);
    };
    ParameterService.prototype.archiveProduct = function (product) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/products/archive", {
            product: product
        }).do(function (data) {
            console.log("refreshing objects...");
            _this.getProducts(true).subscribe();
        });
    };
    ParameterService.prototype.saveProduct = function (product) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/products", {
            product: product
        }).do(function (data) {
            console.log("refreshing objects...");
            _this.getProducts(true).subscribe();
        });
    };
    ParameterService.prototype.savePaymentMethod = function (payment_method) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/payment_methods", {
            payment_method: payment_method
        }).do(function (data) {
            _this.getPaymentMethods(true).subscribe();
        });
    };
    ParameterService.prototype.saveAcquirer = function (acquirer) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/acquirers", {
            acquirer: acquirer
        }).do(function (data) {
            _this.getAcquirers(true).subscribe();
        });
    };
    ParameterService.prototype.saveCurrency = function (currency) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/currencies", {
            currency: currency
        }).do(function (data) {
            _this.getCurrencies(true).subscribe();
        });
    };
    ParameterService.prototype.saveProductCategory = function (product_category) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/product_categories", {
            product_category: product_category
        }).do(function (data) {
            _this.getProductCategories(true).subscribe();
        });
    };
    ParameterService.prototype.saveVoucher = function (voucher) {
        return this.http
            .post(this.dataUrl + "/parameters/vouchers", {
            voucher: voucher
        });
    };
    ParameterService.prototype.ToggleAssociateBranchAcquirer = function (branch_id, acquirer_id) {
        return this.http
            .post(this.dataUrl + "/branches_acquirers", {
            branch_id: branch_id,
            acquirer_id: acquirer_id
        });
    };
    ParameterService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, typeof (_a = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _a || Object])
    ], ParameterService);
    return ParameterService;
    var _a;
}());
exports.ParameterService = ParameterService;
//# sourceMappingURL=parameter-service.js.map