"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var contact_listitem_component_1 = require("app/shared/components/contact-listitem/contact-listitem.component");
var ContactListitemModule = /** @class */ (function () {
    function ContactListitemModule() {
    }
    ContactListitemModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                contact_listitem_component_1.ContactListitemComponent
            ], exports: [
                contact_listitem_component_1.ContactListitemComponent
            ]
        })
    ], ContactListitemModule);
    return ContactListitemModule;
}());
exports.ContactListitemModule = ContactListitemModule;
//# sourceMappingURL=contact-listitem.module.js.map