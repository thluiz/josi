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
var card_service_1 = require("app/services/card-service");
var core_1 = require("@angular/core");
var security_service_1 = require("app/services/security-service");
var parameter_service_1 = require("app/services/parameter-service");
var person_service_1 = require("app/services/person-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var rxjs_1 = require("rxjs");
var PersonPartnershipListComponent = /** @class */ (function () {
    function PersonPartnershipListComponent(modalService, parameterService, securityService, cardService, personService) {
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.securityService = securityService;
        this.cardService = cardService;
        this.personService = personService;
        this.showHeader = true;
        this.saving = false;
        this.new_item = { name: "",
            valid: false,
            comment: "",
            person_id: 0,
            branch_id: 0,
            operator_id: 0,
            indication_contact_type: 0
        };
        this.errors = [];
    }
    PersonPartnershipListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.changes_subscriber = this.personService.partnershipChanges$
            .filter(function (data) { return data != null && data.person_id == _this.person.id; })
            .subscribe(function (data) {
            _this.load_items();
        });
        this.load_items();
    };
    PersonPartnershipListComponent.prototype.ngOnDestroy = function () {
        this.changes_subscriber.unsubscribe();
    };
    PersonPartnershipListComponent.prototype.load_items = function () {
        var _this = this;
        if (this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents())) {
            return;
        }
        this.personService.getPersonPartnerships(this.person.id)
            .subscribe(function (data) {
            _this.items = data;
        });
        this.last_call = new Date();
    };
    PersonPartnershipListComponent.prototype.open = function (content) {
        var _this = this;
        this.saving = false;
        this.new_item = { name: "",
            valid: false,
            comment: "",
            person_id: this.person.id,
            branch_id: this.person.branch_id,
            operator_id: 0,
            indication_contact_type: 0
        };
        rxjs_1.Observable.zip(this.securityService.getCurrentUserData(), this.parameterService.getActiveBranches(), this.cardService.getOperators(), function (user, branches, operators) {
            _this.new_item.operator_id = user.person_id;
            _this.branches = branches;
            _this.operators = operators;
            _this.modalService.open(content).result.then(function (result) {
            }, function (reason) {
                console.log(reason);
            });
        }).subscribe();
    };
    PersonPartnershipListComponent.prototype.save_new_item = function (close_action) {
        var _this = this;
        this.saving = true;
        this.personService.savePartnership(this.new_item).subscribe(function (data) {
            _this.saving = false;
            if (close_action) {
                close_action();
            }
        });
    };
    PersonPartnershipListComponent.prototype.validate_new_item = function () {
        this.errors = [];
        if (!this.new_item) {
            return;
        }
        if (!this.new_item.name || this.new_item.name.length < 3) {
            this.errors.push("Informe o nome da empresa para parceria");
        }
        if (this.new_item.branch_id <= 0) {
            this.errors.push("Informe o núcleo responsável pela indicação");
        }
        if (this.new_item.operator_id <= 0) {
            this.errors.push("Informe o operador responsável pela indicação");
        }
        this.new_item.valid = this.errors.length <= 0;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonPartnershipListComponent.prototype, "d", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonPartnershipListComponent.prototype, "person", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonPartnershipListComponent.prototype, "showHeader", void 0);
    PersonPartnershipListComponent = __decorate([
        core_1.Component({
            selector: 'person-partnership-list',
            templateUrl: './person-partnership-list.component.html',
            styleUrls: ['../../../../../../assets/customizations.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, typeof (_c = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _c || Object, typeof (_d = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _d || Object])
    ], PersonPartnershipListComponent);
    return PersonPartnershipListComponent;
    var _a, _b, _c, _d;
}());
exports.PersonPartnershipListComponent = PersonPartnershipListComponent;
//# sourceMappingURL=person-partnership-list.component.js.map