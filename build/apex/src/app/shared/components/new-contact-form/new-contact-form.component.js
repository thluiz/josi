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
var person_service_1 = require("app/services/person-service");
var parameter_service_1 = require("app/services/parameter-service");
var NewContactFormComponent = /** @class */ (function () {
    function NewContactFormComponent(personService, parameterService) {
        this.personService = personService;
        this.parameterService = parameterService;
        this.new_contact = { principal: 0 };
        this.defaultPrincipal = false;
    }
    NewContactFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.parameterService.getContactTypes().subscribe(function (data) {
            _this.contact_types = data;
        }, function (reason) {
            console.log(reason);
        });
        this.new_contact.principal = this.defaultPrincipal ? 1 : 0;
    };
    NewContactFormComponent.prototype.get_details_and_validate = function () {
        var _this = this;
        var contact_type = this.contact_types.find(function (ct) { return ct.id == _this.new_contact.contact_type; });
        this.new_contact.contact_helper_text = contact_type.helper_text;
        this.new_contact.contact_placeholder = contact_type.placeholder;
        this.validate_new_contact();
    };
    NewContactFormComponent.prototype.validate_new_contact = function () {
        this.new_contact.is_valid = false;
        if (this.new_contact.contact_type <= 0
            || !this.new_contact.contact
            || this.new_contact.contact.length <= 0)
            return;
        if (this.new_contact.contact.indexOf("http") >= 0
            || this.new_contact.contact.indexOf("fb") >= 0
            || this.new_contact.contact.indexOf("facebook") >= 0
            || this.new_contact.contact.indexOf("instagram") >= 0
            || this.new_contact.contact.indexOf("twitter") >= 0)
            return;
        this.new_contact.is_valid = true;
    };
    NewContactFormComponent.prototype.save_contact = function () {
        var _this = this;
        this.personService.savePersonContact(this.person.id, this.new_contact.contact_type, this.new_contact.contact, this.new_contact.details, this.new_contact.principal)
            .subscribe(function (data) {
            if (_this.afterSave) {
                _this.afterSave();
            }
        });
    };
    __decorate([
        core_1.Input("person"),
        __metadata("design:type", Object)
    ], NewContactFormComponent.prototype, "person", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function)
    ], NewContactFormComponent.prototype, "afterSave", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function)
    ], NewContactFormComponent.prototype, "cancelAction", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NewContactFormComponent.prototype, "defaultPrincipal", void 0);
    NewContactFormComponent = __decorate([
        core_1.Component({
            selector: 'new-contact-form',
            templateUrl: './new-contact-form.component.html',
            styleUrls: ['../../../../assets/customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object])
    ], NewContactFormComponent);
    return NewContactFormComponent;
    var _a, _b;
}());
exports.NewContactFormComponent = NewContactFormComponent;
//# sourceMappingURL=new-contact-form.component.js.map