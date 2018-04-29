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
var utils_service_1 = require("app/services/utils-service");
var ContactButtonitemComponent = /** @class */ (function () {
    function ContactButtonitemComponent(utilsService) {
        this.utilsService = utilsService;
        this.showContact = false;
    }
    ContactButtonitemComponent.prototype.ngOnInit = function () {
        this.contact_data.safe_url = this.link_to_contact(this.contact_data);
    };
    ContactButtonitemComponent.prototype.link_to_contact = function (contact) {
        return this.utilsService.sanitize(contact.base_url + contact.contact);
    };
    __decorate([
        core_1.Input("contact"),
        __metadata("design:type", Object)
    ], ContactButtonitemComponent.prototype, "contact_data", void 0);
    ContactButtonitemComponent = __decorate([
        core_1.Component({
            selector: 'contact-buttonitem',
            templateUrl: './contact-buttonitem.component.html',
            styleUrls: ['./contact-buttonitem.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _a || Object])
    ], ContactButtonitemComponent);
    return ContactButtonitemComponent;
    var _a;
}());
exports.ContactButtonitemComponent = ContactButtonitemComponent;
//# sourceMappingURL=contact-buttonitem.component.js.map