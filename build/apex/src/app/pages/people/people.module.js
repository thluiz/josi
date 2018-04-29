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
var forms_1 = require("@angular/forms");
var person_card_module_1 = require("./../../shared/components/person-card/person-card.module");
var people_service_provider_page_component_1 = require("./people-service-provider/people-service-provider-page.component");
var interested_panel_page_component_1 = require("./interested/interested-panel-page.component");
var person_edit_page_component_1 = require("./edit/person-edit-page.component");
var person_page_component_1 = require("./person/person-page.component");
var people_away_panel_page_component_1 = require("./people-away/people-away-panel-page.component");
var management_panel_page_component_1 = require("./management-panel/management-panel-page.component");
var members_panel_page_component_1 = require("./members-panel/members-panel-page.component");
var operator_page_component_1 = require("app/pages/people/operator/operator-page.component");
var operator_config_page_component_1 = require("./operator-config/operator-config-page.component");
var people_routing_module_1 = require("./people-routing.module");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_markdown_1 = require("ngx-markdown");
var people_header_module_1 = require("app/pages/people/shared/components/people-header/people-header.module");
var change_members_view_module_1 = require("app/pages/people/shared/components/change-members-view/change-members-view.module");
var person_comment_list_module_1 = require("app/pages/people/shared/components/person-comment-list/person-comment-list.module");
var contact_listitem_module_1 = require("app/shared/components/contact-listitem/contact-listitem.module");
var person_data_treatment_modal_module_1 = require("app/shared/components/person-data-treatment-modal/person-data-treatment-modal.module");
var person_status_line_module_1 = require("app/shared/components/person-status-line/person-status-line.module");
var person_contact_list_module_1 = require("app/pages/people/shared/components/person-contact-list/person-contact-list.module");
var float_action_center_module_1 = require("app/shared/components/float-action-center/float-action-center.module");
var voucher_people_page_component_1 = require("./voucher/voucher-people-page.component");
var person_indication_list_module_1 = require("app/shared/components/person-indication-list/person-indication-list.module");
var person_partnership_list_module_1 = require("app/pages/people/shared/components/person-partnership-list/person-partnership-list.module");
var person_external_unit_list_module_1 = require("app/pages/people/shared/components/person-external-unit-list/person-external-unit-list.module");
var PeopleModule = /** @class */ (function () {
    function PeopleModule() {
    }
    PeopleModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                people_routing_module_1.PeopleRoutingModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbModule,
                ng_bootstrap_1.NgbDatepickerModule.forRoot(),
                ng_bootstrap_1.NgbTimepickerModule.forRoot(),
                ngx_markdown_1.MarkdownModule.forRoot(),
                person_card_module_1.PersonCardModule,
                person_contact_list_module_1.PersonContactListModule,
                person_status_line_module_1.PersonStatusLineModule,
                person_data_treatment_modal_module_1.PersonDataTreatmentModalModule,
                person_comment_list_module_1.PersonCommentListModule,
                people_header_module_1.PeopleHeaderModule,
                change_members_view_module_1.ChangeMembersViewModule,
                contact_listitem_module_1.ContactListitemModule,
                float_action_center_module_1.FloatActionCenterModule,
                person_indication_list_module_1.PersonIndicationListModule,
                person_partnership_list_module_1.PersonPartnershipListModule,
                person_external_unit_list_module_1.PersonExternalUnitListModule
            ],
            declarations: [
                members_panel_page_component_1.MembersPanelPageComponent,
                management_panel_page_component_1.ManagementPanelPageComponent,
                person_page_component_1.PersonPageComponent,
                person_edit_page_component_1.PersonEditPageComponent,
                interested_panel_page_component_1.InterestedPanelPageComponent,
                people_away_panel_page_component_1.PeopleAwayPageComponent,
                people_service_provider_page_component_1.PeopleServiceProviderPageComponent,
                operator_page_component_1.OperatorPageComponent,
                operator_config_page_component_1.OperatorConfigPageComponent,
                voucher_people_page_component_1.VoucherPeoplePageComponent
            ]
        })
    ], PeopleModule);
    return PeopleModule;
}());
exports.PeopleModule = PeopleModule;
//# sourceMappingURL=people.module.js.map