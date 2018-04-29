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
var modal_service_1 = require("app/services/modal-service");
var add_comment_modal_component_1 = require("app/shared/components/add-comment-modal/add-comment-modal.component");
var card_detail_modal_component_1 = require("./shared/components/card-detail-modal/card-detail-modal.component");
var card_edit_modal_component_1 = require("./shared/components/card-edit-modal/card-edit-modal.component");
var incident_comments_list_modal_component_1 = require("app/shared/components/incident-comments-list-modal/incident-comments-list-modal.component");
var incident_treatment_modal_component_1 = require("app/shared/components/incident-treatment-modal/incident-treatment-modal.component");
var move_card_modal_component_1 = require("app/shared/components/move-card-modal/move-card-modal.component");
var person_communication_treatment_modal_component_1 = require("app/shared/components/person-communication-treatment-modal/person-communication-treatment-modal.component");
var person_data_treatment_modal_component_1 = require("app/shared/components/person-data-treatment-modal/person-data-treatment-modal.component");
var new_incident_modal_component_1 = require("app/shared/components/new-incident-modal/new-incident-modal.component");
var new_person_modal_component_1 = require("app/shared/components/new-person-modal/new-person-modal.component");
var new_card_modal_component_1 = require("app/shared/components/new-card-modal/new-card-modal.component");
var person_financial_treatment_modal_component_1 = require("app/shared/components/person-financial-treatment-modal/person-financial-treatment-modal.component");
var person_schedule_treatment_modal_component_1 = require("app/shared/components/person-schedule-treatment-modal/person-schedule-treatment-modal.component");
var AppComponent = /** @class */ (function () {
    function AppComponent(modalService) {
        this.modalService = modalService;
    }
    AppComponent.prototype.ngAfterViewInit = function () {
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.modal_subscriber = this.modalService.openModal$
            .subscribe(function (data) {
            switch (data.type) {
                case modal_service_1.ModalType.PersonTreatment:
                    _this.personDataTreatmentModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.PersonComunicationTreatment:
                    _this.personComunicationTreatmentModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.IncidentTreatment:
                    _this.incidentTreatmentModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.AddPersonComment:
                    _this.addCommentModal.open(data.parameters, add_comment_modal_component_1.CommentType.Person);
                    break;
                case modal_service_1.ModalType.AddIncidentComment:
                    _this.addCommentModal.open(data.parameters, add_comment_modal_component_1.CommentType.Incident);
                    break;
                case modal_service_1.ModalType.AddCardComment:
                    _this.addCommentModal.open(data.parameters, add_comment_modal_component_1.CommentType.Card);
                    break;
                case modal_service_1.ModalType.IncidentCommentList:
                    _this.incidentCommentsList.open(data.parameters);
                    break;
                case modal_service_1.ModalType.AddPerson:
                    _this.newPersonModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.AddIncident:
                    _this.newIncidentModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.AddTask:
                    if (!data.parameters) {
                        data.parameters = {};
                    }
                    data.parameters.card_type = new_card_modal_component_1.CardType.Task;
                    _this.newCardModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.AddProject:
                    if (!data.parameters) {
                        data.parameters = {};
                    }
                    data.parameters.card_type = new_card_modal_component_1.CardType.Project;
                    _this.newCardModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.AddProjectTask:
                    if (!data.parameters) {
                        data.parameters = {};
                    }
                    data.parameters.card_type = new_card_modal_component_1.CardType.ProjectTask;
                    _this.newCardModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.DetailTask:
                    _this.cardDetailModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.EditCard:
                    _this.cardEditModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.MoveCard:
                    _this.moveCardModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.PersonFinancialTreatment:
                    _this.personFinancialTreatmentModal.open(data.parameters);
                    break;
                case modal_service_1.ModalType.PersonScheduleTreatment:
                    _this.personScheduleTreatmentModal.open(data.parameters);
                    break;
            }
        });
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.modal_subscriber.unsubscribe();
    };
    __decorate([
        core_1.ViewChild(person_data_treatment_modal_component_1.PersonDataTreatmentModalComponent),
        __metadata("design:type", typeof (_a = typeof person_data_treatment_modal_component_1.PersonDataTreatmentModalComponent !== "undefined" && person_data_treatment_modal_component_1.PersonDataTreatmentModalComponent) === "function" && _a || Object)
    ], AppComponent.prototype, "personDataTreatmentModal", void 0);
    __decorate([
        core_1.ViewChild(incident_treatment_modal_component_1.IncidentTreatmentModalComponent),
        __metadata("design:type", typeof (_b = typeof incident_treatment_modal_component_1.IncidentTreatmentModalComponent !== "undefined" && incident_treatment_modal_component_1.IncidentTreatmentModalComponent) === "function" && _b || Object)
    ], AppComponent.prototype, "incidentTreatmentModal", void 0);
    __decorate([
        core_1.ViewChild(add_comment_modal_component_1.AddCommentModalComponent),
        __metadata("design:type", typeof (_c = typeof add_comment_modal_component_1.AddCommentModalComponent !== "undefined" && add_comment_modal_component_1.AddCommentModalComponent) === "function" && _c || Object)
    ], AppComponent.prototype, "addCommentModal", void 0);
    __decorate([
        core_1.ViewChild(incident_comments_list_modal_component_1.IncidentCommentsListModalComponent),
        __metadata("design:type", typeof (_d = typeof incident_comments_list_modal_component_1.IncidentCommentsListModalComponent !== "undefined" && incident_comments_list_modal_component_1.IncidentCommentsListModalComponent) === "function" && _d || Object)
    ], AppComponent.prototype, "incidentCommentsList", void 0);
    __decorate([
        core_1.ViewChild(new_person_modal_component_1.NewPersonModalComponent),
        __metadata("design:type", typeof (_e = typeof new_person_modal_component_1.NewPersonModalComponent !== "undefined" && new_person_modal_component_1.NewPersonModalComponent) === "function" && _e || Object)
    ], AppComponent.prototype, "newPersonModal", void 0);
    __decorate([
        core_1.ViewChild(new_incident_modal_component_1.NewInicidentModalComponent),
        __metadata("design:type", typeof (_f = typeof new_incident_modal_component_1.NewInicidentModalComponent !== "undefined" && new_incident_modal_component_1.NewInicidentModalComponent) === "function" && _f || Object)
    ], AppComponent.prototype, "newIncidentModal", void 0);
    __decorate([
        core_1.ViewChild(new_card_modal_component_1.NewCardModalComponent),
        __metadata("design:type", typeof (_g = typeof new_card_modal_component_1.NewCardModalComponent !== "undefined" && new_card_modal_component_1.NewCardModalComponent) === "function" && _g || Object)
    ], AppComponent.prototype, "newCardModal", void 0);
    __decorate([
        core_1.ViewChild(card_detail_modal_component_1.CardDetailModalComponent),
        __metadata("design:type", card_detail_modal_component_1.CardDetailModalComponent)
    ], AppComponent.prototype, "cardDetailModal", void 0);
    __decorate([
        core_1.ViewChild(card_edit_modal_component_1.CardEditModalComponent),
        __metadata("design:type", card_edit_modal_component_1.CardEditModalComponent)
    ], AppComponent.prototype, "cardEditModal", void 0);
    __decorate([
        core_1.ViewChild(person_communication_treatment_modal_component_1.PersonComunicationTreatmentModalComponent),
        __metadata("design:type", typeof (_h = typeof person_communication_treatment_modal_component_1.PersonComunicationTreatmentModalComponent !== "undefined" && person_communication_treatment_modal_component_1.PersonComunicationTreatmentModalComponent) === "function" && _h || Object)
    ], AppComponent.prototype, "personComunicationTreatmentModal", void 0);
    __decorate([
        core_1.ViewChild(move_card_modal_component_1.MoveCardModalComponent),
        __metadata("design:type", typeof (_j = typeof move_card_modal_component_1.MoveCardModalComponent !== "undefined" && move_card_modal_component_1.MoveCardModalComponent) === "function" && _j || Object)
    ], AppComponent.prototype, "moveCardModal", void 0);
    __decorate([
        core_1.ViewChild(person_financial_treatment_modal_component_1.PersonFinancialTreatmentModalComponent),
        __metadata("design:type", typeof (_k = typeof person_financial_treatment_modal_component_1.PersonFinancialTreatmentModalComponent !== "undefined" && person_financial_treatment_modal_component_1.PersonFinancialTreatmentModalComponent) === "function" && _k || Object)
    ], AppComponent.prototype, "personFinancialTreatmentModal", void 0);
    __decorate([
        core_1.ViewChild(person_schedule_treatment_modal_component_1.PersonScheduleTreatmentModalComponent),
        __metadata("design:type", typeof (_l = typeof person_schedule_treatment_modal_component_1.PersonScheduleTreatmentModalComponent !== "undefined" && person_schedule_treatment_modal_component_1.PersonScheduleTreatmentModalComponent) === "function" && _l || Object)
    ], AppComponent.prototype, "personScheduleTreatmentModal", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['../assets/customizations.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_m = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _m || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map