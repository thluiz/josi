"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compact_incident_listitem_module_1 = require("./../../shared/components/compact-incident-listitem/compact-incident-listitem.module");
var new_incident_modal_module_1 = require("./../../shared/components/new-incident-modal/new-incident-modal.module");
var person_card_module_1 = require("./../../shared/components/person-card/person-card.module");
var change_view_module_1 = require("./shared/change-view/change-view.module");
var person_status_line_module_1 = require("app/shared/components/person-status-line/person-status-line.module");
var current_activities_module_1 = require("app/shared/components/current-activities/current-activities.module");
var incident_agenda_listitem_module_1 = require("app/shared/components/incident-agenda-listitem/incident-agenda-listitem.module");
var lateral_summary_module_1 = require("app/shared/components/lateral-summary/lateral-summary.module");
var change_branch_module_1 = require("app/pages/diary/shared/change-branch/change-branch.module");
var float_action_center_module_1 = require("app/shared/components/float-action-center/float-action-center.module");
var diary_header_module_1 = require("app/pages/diary/shared/diary-header/diary-header.module");
var agenda_page_component_1 = require("./agenda-page/agenda-page.component");
var daily_page_component_1 = require("./daily-page/daily-page.component");
var weekly_page_component_1 = require("./weekly-page/weekly-page.component");
var sumary_page_component_1 = require("./sumary-page/sumary-page.component");
var current_activities_page_component_1 = require("./current-activities-page/current-activities-page.component");
var diary_routing_module_1 = require("./diary-routing.module");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_markdown_1 = require("ngx-markdown");
var DiaryModule = /** @class */ (function () {
    function DiaryModule() {
    }
    DiaryModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                diary_routing_module_1.DiaryRoutingModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ng_bootstrap_1.NgbDatepickerModule.forRoot(),
                ng_bootstrap_1.NgbTimepickerModule.forRoot(),
                ng_bootstrap_1.NgbModule,
                change_view_module_1.DailyChangeViewModule,
                person_card_module_1.PersonCardModule,
                new_incident_modal_module_1.NewIncidentModalModule,
                compact_incident_listitem_module_1.CompactIncidentListitemModule,
                current_activities_module_1.CurrentActivitiesModule,
                person_status_line_module_1.PersonStatusLineModule,
                incident_agenda_listitem_module_1.IncidentAgendaListitemModule,
                lateral_summary_module_1.LateralSummaryModule,
                diary_header_module_1.DiaryHeaderModule,
                change_branch_module_1.DiaryChangeBranchModule,
                ngx_markdown_1.MarkdownModule.forRoot(),
                float_action_center_module_1.FloatActionCenterModule
            ],
            declarations: [
                daily_page_component_1.DailyPageComponent,
                weekly_page_component_1.WeeklyPageComponent,
                agenda_page_component_1.AgendaPageComponent,
                sumary_page_component_1.SumaryPageComponent,
                current_activities_page_component_1.CurrentActivitiesPageComponent
            ]
        })
    ], DiaryModule);
    return DiaryModule;
}());
exports.DiaryModule = DiaryModule;
//# sourceMappingURL=diary.module.js.map