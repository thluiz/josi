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
var rxjs_1 = require("rxjs");
var router_1 = require("@angular/router");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var parameter_service_1 = require("app/services/parameter-service");
var core_1 = require("@angular/core");
var BranchDetailPageComponent = /** @class */ (function () {
    function BranchDetailPageComponent(parameterService, ngbModalService, route, router) {
        this.parameterService = parameterService;
        this.ngbModalService = ngbModalService;
        this.route = route;
        this.router = router;
        this.saving = false;
    }
    BranchDetailPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = +params['id'];
            _this.load_data();
        });
    };
    BranchDetailPageComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    BranchDetailPageComponent.prototype.toggle_associate_acquirer = function (acquirer, close_action) {
        var _this = this;
        this.parameterService.ToggleAssociateBranchAcquirer(this.id, acquirer).subscribe(function (data) {
            _this.load_data();
            if (close_action) {
                close_action();
            }
        });
    };
    BranchDetailPageComponent.prototype.build_map = function (map) {
        if (map === void 0) { map = { start_time: {}, end_time: {},
            incident_type_id: 10,
            receive_voucher: false,
            week_days: [],
            start_hour: 9,
            start_minute: 0,
            end_hour: 10,
            end_minute: 0,
            branch_id: 0
        }; }
        map.branch_id = this.current.id;
        for (var i = 1; i <= 7; i++) {
            var map_week = map.week_days.find(function (wk) { return wk.week_day == i; });
            if (!map_week) {
                map.week_days[map.week_days.length] = {
                    week_day: i,
                    selected: false,
                    abrev: this.getWeekDayAbrev(i)
                };
            }
            else {
                map_week.abrev = this.getWeekDayAbrev(i);
                if (map_week.selected === undefined) {
                    map_week.selected = true;
                }
            }
        }
        map.start_time = {
            hour: map.start_hour,
            minute: map.start_minute
        };
        map.end_time = {
            hour: map.end_hour,
            minute: map.end_minute
        };
        map.week_days = map.week_days.sort(function (w1, w2) {
            if (w1.week_day > w2.week_day)
                return 1;
            if (w1.week_day == w2.week_day)
                return 0;
            if (w1.week_day < w2.week_day)
                return -1;
        });
        return map;
    };
    BranchDetailPageComponent.prototype.save_branch_product = function (close_action) {
        var _this = this;
        this.saving = true;
        this.parameterService.saveBranchProduct(this.current.id, this.current_product)
            .subscribe(function (data) {
            if (close_action) {
                close_action();
            }
            _this.saving = false;
            _this.load_data();
        });
    };
    BranchDetailPageComponent.prototype.save_map = function (map, close_action) {
        var _this = this;
        console.log(map);
        this.parameterService.saveBranchMap(map).subscribe(function (data) {
            if (close_action) {
                _this.load_data(function () { return close_action('save map'); });
            }
        });
    };
    BranchDetailPageComponent.prototype.archive_map = function (map) {
        var _this = this;
        this.parameterService.archiveMap(map).subscribe(function (data) {
            _this.load_data();
        });
    };
    BranchDetailPageComponent.prototype.getWeekDayAbrev = function (week_day) {
        switch (week_day) {
            case 1:
                return "Dom";
            case 2:
                return "Seg";
            case 3:
                return "Ter";
            case 4:
                return "Qua";
            case 5:
                return "Qui";
            case 6:
                return "Sex";
            case 7:
                return "Sáb";
        }
        return "ND";
    };
    BranchDetailPageComponent.prototype.open_add_map = function (content) {
        this.current_map = this.build_map();
        this.open_modal(content);
    };
    BranchDetailPageComponent.prototype.open_edit_map = function (content, map) {
        this.current_map = this.build_map(map);
        this.open_modal(content);
    };
    BranchDetailPageComponent.prototype.open_add_acquirer = function (content) {
        var _this = this;
        this.current_acquirer = null;
        this.parameterService.getAcquirers().subscribe(function (data) {
            var list = data;
            if (_this.current.accquirers) {
                var current_list_1 = _this.current.accquirers;
                list = list.filter(function (l) { return current_list_1.find(function (c) { return c.id == l.id; }) != null; });
            }
            _this.acquirers = list;
            _this.open_modal(content);
        });
    };
    BranchDetailPageComponent.prototype.open_edit_product = function (product, content) {
        var _this = this;
        this.saving = false;
        this.current_product = product;
        this.current_product.name = product.product;
        rxjs_1.Observable.zip(this.parameterService.getProductCategories(), this.parameterService.getCurrencies(), function (categories, currencies) {
            _this.categories = categories;
            _this.currencies = currencies;
            _this.open_modal(content);
        }).subscribe();
    };
    BranchDetailPageComponent.prototype.open_add_product = function (content) {
        var _this = this;
        this.saving = false;
        this.current_product = {};
        rxjs_1.Observable.zip(this.parameterService.getProductCategories(), this.parameterService.getCurrencies(), function (categories, currencies) {
            _this.categories = categories;
            _this.currencies = currencies;
            _this.open_modal(content);
        }).subscribe();
    };
    BranchDetailPageComponent.prototype.open_associate_product = function (content) {
        var _this = this;
        this.current_product_association = { valid: false };
        this.saving = false;
        rxjs_1.Observable.zip(this.parameterService.getProductCategories(), this.parameterService.getProducts(), function (categories, products) {
            _this.categories = categories;
            _this.all_products = products;
            _this.open_modal(content);
        }).subscribe();
    };
    BranchDetailPageComponent.prototype.get_products_from_category = function () {
        var _this = this;
        if (this.current_product_association.product_id > 0) {
            this.current_product_association.product_id = 0;
            this.current_product_association.valid = false;
        }
        var products = this.all_products.filter(function (p) { return p.category_id == _this.current_product_association.category_id; });
        if (this.current.associated_products != null && this.current.associated_products.length > 0) {
            //TODO: Filter already defined products
            // products = products.filter(f => this.current.associated_products.find(p2 => p2.id != f.id) == null);
        }
        this.products_from_category = products;
    };
    BranchDetailPageComponent.prototype.change_base_product_for_association = function () {
        var _this = this;
        var current_product = this.all_products.find(function (p) { return p.id == _this.current_product_association.product_id; });
        this.current_product_association.base_value = current_product.base_value;
        this.current_product_association.valid = true;
    };
    BranchDetailPageComponent.prototype.associate_branch_product = function (close_action) {
        var _this = this;
        this.parameterService.associateBranchProduct({
            branch_id: this.id,
            product_id: this.current_product_association.product_id,
            base_value: this.current_product_association.base_value
        }).subscribe(function (data) {
            _this.load_data();
            if (close_action) {
                close_action();
            }
        });
    };
    BranchDetailPageComponent.prototype.archive_branch_product = function (product) {
        var _this = this;
        this.parameterService.archiveBranchProduct({
            product: product
        }).subscribe(function (data) {
            _this.load_data();
        });
    };
    BranchDetailPageComponent.prototype.open_modal = function (content) {
        this.ngbModalService.open(content).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    BranchDetailPageComponent.prototype.load_data = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = function () { }; }
        rxjs_1.Observable.zip(this.parameterService.getBranch(this.id), this.parameterService.getBranchMap(this.id), this.parameterService.getIncidentTypes(), this.parameterService.getBranchProducts(this.id), function (branch_data, map, incident_types, branch_products) {
            var current = branch_data[0];
            current.map = map;
            current.associated_products = branch_products.filter(function (bp) { return bp.product_id != null; });
            current.branch_products = branch_products.filter(function (bp) { return bp.product_id == null; });
            if (!current.map) {
                current.map = [];
            }
            if (!current.acquirers) {
                current.acquirers = [];
            }
            var types = incident_types.filter(function (i) { return i.use_in_map; });
            incident_types.forEach(function (tp) {
                if (tp.childrens) {
                    tp.childrens.filter(function (i) { return i.use_in_map; }).forEach(function (i) {
                        types.push(i);
                    });
                }
            });
            _this.incident_types = types;
            _this.current = current;
            if (callback) {
                callback();
            }
        }).subscribe();
    };
    BranchDetailPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './branch-detail-page.component.html',
            styleUrls: ['../parameters-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object, ng_bootstrap_1.NgbModal,
            router_1.ActivatedRoute,
            router_1.Router])
    ], BranchDetailPageComponent);
    return BranchDetailPageComponent;
    var _a;
}());
exports.BranchDetailPageComponent = BranchDetailPageComponent;
//# sourceMappingURL=branch-detail-page.component.js.map