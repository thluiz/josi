"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ng_application_insights_1 = require("@markpieszak/ng-application-insights");
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var animations_1 = require("@angular/platform-browser/animations");
var app_routing_module_1 = require("./app-routing.module");
var shared_module_1 = require("./shared/shared.module");
var app_component_1 = require("./app.component");
var content_layout_component_1 = require("./layouts/content/content-layout.component");
var full_layout_component_1 = require("./layouts/full/full-layout.component");
var auth_service_1 = require("./shared/auth/auth.service");
var auth_guard_service_1 = require("./shared/auth/auth-guard.service");
var http_1 = require("@angular/common/http");
var httpinterceptor_1 = require("./httpinterceptor");
var card_service_1 = require("app/services/card-service");
var financial_service_1 = require("app/services/financial-service");
var incident_service_1 = require("app/services/incident-service");
var modal_service_1 = require("app/services/modal-service");
var parameter_service_1 = require("app/services/parameter-service");
var person_service_1 = require("./services/person-service");
var security_service_1 = require("app/services/security-service");
var utils_service_1 = require("app/services/utils-service");
var add_comment_modal_module_1 = require("app/shared/components/add-comment-modal/add-comment-modal.module");
var card_detail_modal_module_1 = require("app/shared/components/card-detail-modal/card-detail-modal.module");
var card_edit_modal_module_1 = require("app/shared/components/card-edit-modal/card-edit-modal.module");
var incident_comments_list_modal_module_1 = require("app/shared/components/incident-comments-list-modal/incident-comments-list-modal.module");
var incident_treatment_modal_module_1 = require("app/shared/components/incident-treatment-modal/incident-treatment-modal.module");
var new_card_modal_module_1 = require("./shared/components/new-card-modal/new-card-modal.module");
var new_incident_modal_module_1 = require("./shared/components/new-incident-modal/new-incident-modal.module");
var new_person_modal_module_1 = require("app/shared/components/new-person-modal/new-person-modal.module");
var move_card_modal_module_1 = require("app/shared/components/move-card-modal/move-card-modal.module");
var person_communication_treatment_modal_module_1 = require("app/shared/components/person-communication-treatment-modal/person-communication-treatment-modal.module");
var person_data_treatment_modal_module_1 = require("app/shared/components/person-data-treatment-modal/person-data-treatment-modal.module");
var person_financial_treatment_modal_module_1 = require("app/shared/components/person-financial-treatment-modal/person-financial-treatment-modal.module");
var person_schedule_treatment_modal_module_1 = require("app/shared/components/person-schedule-treatment-modal/person-schedule-treatment-modal.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                full_layout_component_1.FullLayoutComponent,
                content_layout_component_1.ContentLayoutComponent
            ],
            imports: [
                animations_1.BrowserAnimationsModule,
                app_routing_module_1.AppRoutingModule,
                shared_module_1.SharedModule,
                ng_bootstrap_1.NgbModule.forRoot(),
                http_1.HttpClientModule,
                person_data_treatment_modal_module_1.PersonDataTreatmentModalModule,
                person_communication_treatment_modal_module_1.PersonComunicationTreatmentModalModule,
                incident_treatment_modal_module_1.IncidentTreatmentModalModule,
                add_comment_modal_module_1.AddCommentModalModule,
                incident_comments_list_modal_module_1.IncidentCommentsListModalModule,
                new_person_modal_module_1.NewPersonModalModule,
                new_incident_modal_module_1.NewIncidentModalModule,
                new_card_modal_module_1.NewCardModalModule,
                card_detail_modal_module_1.CardDetailModalModule,
                card_edit_modal_module_1.CardEditModalModule,
                move_card_modal_module_1.MoveCardModalModule,
                person_financial_treatment_modal_module_1.PersonFinancialTreatmentModalModule,
                person_schedule_treatment_modal_module_1.PersonScheduleTreatmentModalModule,
                ng_application_insights_1.ApplicationInsightsModule.forRoot({
                    instrumentationKey: 'afcbdd7f-c599-45cd-8555-812c83b75ae6'
                })
                //BrowserModule,
                //FormsModule, 
                //JsonpModule
            ],
            providers: [
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: httpinterceptor_1.SecurityHttpInterceptor,
                    multi: true
                },
                auth_service_1.AuthService,
                auth_guard_service_1.AuthGuard,
                parameter_service_1.ParameterService,
                person_service_1.PersonService,
                incident_service_1.IncidentService,
                utils_service_1.UtilsService,
                modal_service_1.ModalService,
                security_service_1.SecurityService,
                card_service_1.CardService,
                financial_service_1.FinancialService,
                ng_application_insights_1.AppInsightsService
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map