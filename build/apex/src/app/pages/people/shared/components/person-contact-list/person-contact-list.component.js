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
var person_service_1 = require("app/services/person-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var PersonContactListComponent = /** @class */ (function () {
    function PersonContactListComponent(modalService, parameterService, personService) {
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.personService = personService;
        this.showHeader = true;
        this.showOnlyPrincipal = false;
        this.showDelete = true;
    }
    PersonContactListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.contact_changes_subscriber = this.personService.contactChanges$
            .filter(function (data) { return data != null && data.person_id == _this.person.id; })
            .subscribe(function (data) {
            _this.load_contacts();
        });
        this.load_contacts();
    };
    PersonContactListComponent.prototype.ngOnDestroy = function () {
        this.contact_changes_subscriber.unsubscribe();
    };
    PersonContactListComponent.prototype.load_contacts = function () {
        var _this = this;
        if (this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents())) {
            return;
        }
        this.personService.getPersonContacts(this.person.id, this.showOnlyPrincipal)
            .subscribe(function (data) { return _this.contacts = data; });
        this.last_call = new Date();
    };
    PersonContactListComponent.prototype.open = function (content) {
        var _this = this;
        this.parameterService.getContactTypes().subscribe(function (data) {
            _this.modalService.open(content).result.then(function (result) {
            }, function (reason) {
                console.log(reason);
            });
        });
    };
    PersonContactListComponent.prototype.remove_contact = function (contact) {
        this.personService.removePersonContact(this.person.id, contact.id).subscribe();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonContactListComponent.prototype, "d", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonContactListComponent.prototype, "person", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonContactListComponent.prototype, "showHeader", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonContactListComponent.prototype, "showOnlyPrincipal", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonContactListComponent.prototype, "showDelete", void 0);
    PersonContactListComponent = __decorate([
        core_1.Component({
            selector: 'person-contact-list',
            templateUrl: './person-contact-list.component.html',
            styleUrls: ['../../../../../../assets/customizations.scss']
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbModal, typeof (_a = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _a || Object, typeof (_b = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _b || Object])
    ], PersonContactListComponent);
    return PersonContactListComponent;
    var _a, _b;
}());
exports.PersonContactListComponent = PersonContactListComponent;
//# sourceMappingURL=person-contact-list.component.js.map