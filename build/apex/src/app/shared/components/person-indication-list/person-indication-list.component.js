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
var PersonIndicationListComponent = /** @class */ (function () {
    function PersonIndicationListComponent(modalService, parameterService, securityService, cardService, personService) {
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.securityService = securityService;
        this.cardService = cardService;
        this.personService = personService;
        this.showHeader = true;
        this.saving = false;
        this.needed_indications = 0;
        this.new_indication = { name: "",
            contact_type1: 0,
            contact1: "",
            contact_type2: 0,
            contact2: "",
            contact_type3: 0,
            contact3: "",
            valid: false,
            comment: "",
            person_id: 0,
            branch_id: 0,
            operator_id: 0,
            indication_contact_type: 0
        };
        this.errors = [];
    }
    PersonIndicationListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.indication_changes_subscriber = this.personService.indicationChanges$
            .filter(function (data) { return data != null && data.person_id == _this.person.id; })
            .subscribe(function (data) {
            _this.load_indications();
        });
        this.load_indications();
    };
    PersonIndicationListComponent.prototype.ngOnDestroy = function () {
        this.indication_changes_subscriber.unsubscribe();
    };
    PersonIndicationListComponent.prototype.load_indications = function () {
        var _this = this;
        if (this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents())) {
            return;
        }
        this.personService.getPersonIndications(this.person.id)
            .subscribe(function (data) {
            _this.parameterService.getConfigurations().subscribe(function (configs) {
                var minimal = configs.find(function (d) { return d.id == parameter_service_1.Configurations.MinimalIndicationsPerActiveMember.toFixed(); });
                if (minimal.value > 0) {
                    _this.needed_indications = minimal.value - data.length;
                }
            });
            _this.indications = data;
        });
        this.last_call = new Date();
    };
    PersonIndicationListComponent.prototype.open = function (content) {
        var _this = this;
        this.saving = false;
        this.new_indication = { name: "",
            contact_type1: 0,
            contact1: "",
            contact_type2: 0,
            contact2: "",
            contact_type3: 0,
            contact3: "",
            valid: false,
            comment: "",
            person_id: this.person.id,
            branch_id: this.person.branch_id,
            operator_id: 0,
            indication_contact_type: 0
        };
        rxjs_1.Observable.zip(this.securityService.getCurrentUserData(), this.parameterService.getContactTypes(), this.parameterService.getActiveBranches(), this.cardService.getOperators(), function (user, contact_types, branches, operators) {
            _this.new_indication.operator_id = user.person_id;
            _this.contact_types = contact_types;
            _this.branches = branches;
            _this.operators = operators;
            _this.modalService.open(content).result.then(function (result) {
            }, function (reason) {
                console.log(reason);
            });
        }).subscribe();
    };
    PersonIndicationListComponent.prototype.save_new_indication = function (close_action) {
        var _this = this;
        this.saving = true;
        this.personService.saveIndication(this.new_indication).subscribe(function (data) {
            _this.saving = false;
            if (close_action) {
                close_action();
            }
        });
    };
    PersonIndicationListComponent.prototype.remove_indication = function (indication) {
    };
    PersonIndicationListComponent.prototype.validate_new_indication = function () {
        this.errors = [];
        if (!this.new_indication) {
            return;
        }
        if (!this.new_indication.name || this.new_indication.name.length < 3) {
            this.errors.push("Informe o nome da pessoa");
        }
        if (this.new_indication.branch_id <= 0) {
            this.errors.push("Informe o núcleo para indicação");
        }
        if (this.new_indication.operator_id <= 0) {
            this.errors.push("Informe o operador responsável para indicação");
        }
        if ((!this.new_indication.contact1 || this.new_indication.contact1.length < 3)
            && (!this.new_indication.contact2 || this.new_indication.contact2.length < 3)
            && (!this.new_indication.contact3 || this.new_indication.contact3.length < 3)) {
            this.errors.push("Informe ao menos o contato principal da pessoa");
        }
        if (this.new_indication.contact1
            && this.new_indication.contact1.length >= 3
            && this.new_indication.contact_type1 <= 0) {
            this.errors.push("Informe o tipo do primeiro contato");
        }
        if (this.new_indication.contact2
            && this.new_indication.contact2.length >= 3
            && this.new_indication.contact_type2 <= 0) {
            this.errors.push("Informe o tipo do segundo contato");
        }
        if (this.new_indication.contact3
            && this.new_indication.contact3.length >= 3
            && this.new_indication.contact_type3 <= 0) {
            this.errors.push("Informe o tipo do terceiro contato");
        }
        this.new_indication.valid = this.errors.length <= 0;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonIndicationListComponent.prototype, "d", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonIndicationListComponent.prototype, "person", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonIndicationListComponent.prototype, "showHeader", void 0);
    PersonIndicationListComponent = __decorate([
        core_1.Component({
            selector: 'person-indication-list',
            templateUrl: './person-indication-list.component.html',
            styleUrls: ['../../../../assets/customizations.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object, typeof (_b = typeof security_service_1.SecurityService !== "undefined" && security_service_1.SecurityService) === "function" && _b || Object, typeof (_c = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _c || Object, typeof (_d = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _d || Object])
    ], PersonIndicationListComponent);
    return PersonIndicationListComponent;
    var _a, _b, _c, _d;
}());
exports.PersonIndicationListComponent = PersonIndicationListComponent;
//# sourceMappingURL=person-indication-list.component.js.map