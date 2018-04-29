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
var card_service_1 = require("app/services/card-service");
var router_1 = require("@angular/router");
var ng2_dragula_1 = require("ng2-dragula");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var OrganizationConfigPageComponent = /** @class */ (function () {
    function OrganizationConfigPageComponent(cardService, parameterService, route, router, dragulaService, ngbModalService) {
        this.cardService = cardService;
        this.parameterService = parameterService;
        this.route = route;
        this.router = router;
        this.dragulaService = dragulaService;
        this.ngbModalService = ngbModalService;
        this.saving_chart = false;
        this.available_operators = [];
        this.dragulaOptions = {
            removeOnSpill: false
        };
    }
    OrganizationConfigPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = +params['id'];
            _this.parameterService.getPersonCardPositions().subscribe(function (data) {
                _this.card_positions = data.filter(function (cp) { return cp.hierarchical; });
            });
        });
        this.load_organization_data();
    };
    OrganizationConfigPageComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    OrganizationConfigPageComponent.prototype.load_organization_data = function () {
        var _this = this;
        this.cardService.getOrganization(this.id).subscribe(function (data) {
            _this.organization = data;
        });
    };
    OrganizationConfigPageComponent.prototype.add_new_operator = function (content) {
        var _this = this;
        var current_operators = this.organization.people;
        this.cardService.getOperators().subscribe(function (data) {
            _this.available_operators = data.filter(function (o) { return current_operators.find(function (co) { return co.person_id == o.id; }) == null; });
            _this.modalRef = _this.ngbModalService.open(content);
            _this.modalRef.result.then(function (result) {
            }, function (reason) {
                console.log(reason);
            });
        });
    };
    OrganizationConfigPageComponent.prototype.save_new_operator = function () {
        var _this = this;
        this.cardService.saveOperator(this.id, this.new_operator_id).subscribe(function () {
            if (_this.modalRef) {
                _this.modalRef.close();
            }
            _this.load_organization_data();
            _this.new_operator_id = null;
        });
    };
    OrganizationConfigPageComponent.prototype.save_organization_chart = function () {
        var _this = this;
        this.saving_chart = true;
        this.cardService.saveOrganizationChart(this.id, this.organization.people).subscribe(function (data) {
            _this.saving_chart = false;
        });
    };
    OrganizationConfigPageComponent.prototype.remove_person = function (person_card) {
        var _this = this;
        this.cardService.removeOperator(this.id, person_card.person_id).subscribe(function () {
            _this.load_organization_data();
        });
    };
    OrganizationConfigPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './organization-config-page.component.html',
            styleUrls: ['../cards-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _a || Object, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, router_1.ActivatedRoute,
            router_1.Router,
            ng2_dragula_1.DragulaService,
            ng_bootstrap_1.NgbModal])
    ], OrganizationConfigPageComponent);
    return OrganizationConfigPageComponent;
    var _a, _b;
}());
exports.OrganizationConfigPageComponent = OrganizationConfigPageComponent;
//# sourceMappingURL=organization-config-page.component.js.map