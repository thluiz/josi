"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var person_indication_list_module_1 = require("app/shared/components/person-indication-list/person-indication-list.module");
var new_contact_form_module_1 = require("app/shared/components/new-contact-form/new-contact-form.module");
var contact_listitem_module_1 = require("app/shared/components/contact-listitem/contact-listitem.module");
var router_1 = require("@angular/router");
var person_data_treatment_modal_component_1 = require("./person-data-treatment-modal.component");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var PersonDataTreatmentModalModule = /** @class */ (function () {
    function PersonDataTreatmentModalModule() {
    }
    PersonDataTreatmentModalModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule,
                ng_bootstrap_1.NgbDatepickerModule.forRoot(),
                ng_bootstrap_1.NgbTimepickerModule.forRoot(),
                ng_bootstrap_1.NgbModule,
                contact_listitem_module_1.ContactListitemModule,
                new_contact_form_module_1.NewContactFormModule,
                person_indication_list_module_1.PersonIndicationListModule
            ],
            declarations: [
                person_data_treatment_modal_component_1.PersonDataTreatmentModalComponent
            ], exports: [
                person_data_treatment_modal_component_1.PersonDataTreatmentModalComponent
            ]
        })
    ], PersonDataTreatmentModalModule);
    return PersonDataTreatmentModalModule;
}());
exports.PersonDataTreatmentModalModule = PersonDataTreatmentModalModule;
//# sourceMappingURL=person-data-treatment-modal.module.js.map