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
var modal_service_1 = require("app/services/modal-service");
var core_1 = require("@angular/core");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var card_service_1 = require("app/services/card-service");
var incident_service_1 = require("app/services/incident-service");
var person_service_1 = require("app/services/person-service");
var IncidentTreatmentModalComponent = /** @class */ (function () {
    function IncidentTreatmentModalComponent(datePickerConfig, incidentService, ngbModalService, modalService, personService, cardService) {
        this.datePickerConfig = datePickerConfig;
        this.incidentService = incidentService;
        this.ngbModalService = ngbModalService;
        this.modalService = modalService;
        this.personService = personService;
        this.cardService = cardService;
        datePickerConfig.firstDayOfWeek = 7;
    }
    IncidentTreatmentModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.comment_changes_subscriber = this.incidentService.commentChanges$
            .filter(function (i) { return i != null
            && _this.current_incident != null
            && i.id == _this.current_incident.id; })
            .subscribe(function (data) {
            _this.current_incident = data;
        });
    };
    IncidentTreatmentModalComponent.prototype.ngOnDestroy = function () {
        this.comment_changes_subscriber.unsubscribe();
    };
    IncidentTreatmentModalComponent.prototype.open = function (incident) {
        this.current_incident = incident;
        this.ngbModalService.open(this.incident_treatment_modal).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    IncidentTreatmentModalComponent.prototype.begin_remove_incident = function (incident) {
        incident.begin_remove = true;
    };
    IncidentTreatmentModalComponent.prototype.rollback_remove_incident = function (incident) {
        incident.begin_remove = false;
    };
    IncidentTreatmentModalComponent.prototype.begin_treat_incident = function (incident) {
        incident.in_treatment = true;
        if (incident.obrigatory) {
            this.begin_reschedule_incident(incident);
        }
    };
    IncidentTreatmentModalComponent.prototype.begin_reschedule_incident = function (incident) {
        incident.reschedule = true;
        var date = incident.date.split("-");
        incident.new_date = { "year": parseInt(date[0], 10), "month": parseInt(date[1], 10), "day": parseInt(date[2], 10) };
        var hour = incident.start_hour.split(":");
        incident.new_time = { "hour": parseInt(hour[0]), "minute": parseInt(hour[1]) };
    };
    IncidentTreatmentModalComponent.prototype.reset_treat_incident = function (incident) {
        incident.recontact = false;
        incident.reschedule = false;
        incident.in_treatment = false;
    };
    IncidentTreatmentModalComponent.prototype.reset_reschedule = function (incident) {
        incident.reschedule = false;
        if (incident.obrigatory) {
            this.reset_treat_incident(incident);
        }
    };
    IncidentTreatmentModalComponent.prototype.validate_for_closing = function (incident) {
        if (incident.need_description_for_closing
            && (!incident.closing_contact_text
                || incident.closing_contact_text.length < 5)) {
            incident.valid_for_closing = false;
            return;
        }
        incident.valid_for_closing = true;
    };
    IncidentTreatmentModalComponent.prototype.close_incident = function (incident, close_action) {
        this.validate_for_closing(incident);
        if (!incident.valid_for_closing) {
            return;
        }
        incident.closed = true;
        this.incidentService.close_incident(incident)
            .toPromise()
            .catch(function (reason) {
            console.log(reason);
        });
        if (close_action) {
            close_action();
        }
    };
    IncidentTreatmentModalComponent.prototype.remove_incident = function (incident) {
        this.incidentService.remove_incident(incident)
            .toPromise().catch(function (reason) {
            console.log(reason);
        });
    };
    IncidentTreatmentModalComponent.prototype.reschedule_incident = function (incident) {
        incident.treated = true;
        var new_incident = {
            "small_date": incident.new_date.day + "/" + incident.new_date.month,
            "date": incident.new_date.year + "-" + incident.new_date.month + "-" + incident.new_date.day,
            "start_hour": incident.new_time.hour + ":" + incident.new_time.minute,
            "closed": false,
            "abrev": incident.abrev,
            "person_id": incident.person_id,
            "type": incident.type,
            "value": incident.value,
            "id": 0,
            "short_description": incident.short_description,
            "long_description": incident.long_description
        };
        this.incidentService.reschedule_incident(incident, new_incident, {
            contact_text: incident.contact_text
        }).toPromise().catch(function (reason) {
            console.log(reason);
        });
    };
    IncidentTreatmentModalComponent.prototype.validade_treatment_contact_text = function (incident) {
        if (!incident.contact_text || incident.contact_text.length < 5) {
            incident.errors = incident.errors || [];
            incident.errors["need_contact_text"] = true;
            return false;
        }
        incident.errors = incident.errors || [];
        incident.errors["need_contact_text"] = false;
        return true;
    };
    IncidentTreatmentModalComponent.prototype.start_incident = function (incident, close_modal_action) {
        this.incidentService.start_incident(incident)
            .toPromise()
            .then(function (value) { return close_modal_action(); })
            .catch(function (reason) {
            console.log(reason);
        });
    };
    IncidentTreatmentModalComponent.prototype.reopen_incident = function (incident, close_modal_action) {
        this.incidentService.reopen_incident(incident)
            .toPromise()
            .then(function (value) { return close_modal_action(); })
            .catch(function (reason) {
            console.log(reason);
        });
    };
    IncidentTreatmentModalComponent.prototype.cancel_start_incident = function (incident, close_modal_action) {
        this.incidentService.cancel_start_incident(incident)
            .toPromise()
            .then(function (value) {
            close_modal_action();
            incident.cancelling_start = false;
        })
            .catch(function (reason) {
            console.log(reason);
        });
    };
    IncidentTreatmentModalComponent.prototype.open_card_detail = function (card_id) {
        var _this = this;
        this.cardService.getCardData(card_id).subscribe(function (data) {
            _this.modalService.open(modal_service_1.ModalType.DetailTask, data[0]);
        });
    };
    IncidentTreatmentModalComponent.prototype.register_contact_for_incident = function (incident, close_modal_action) {
        if (!this.validade_treatment_contact_text(incident)) {
            return;
        }
        this.incidentService.register_contact_for_incident(incident, {
            contact_text: incident.contact_text
        }).toPromise().then(function (value) { return close_modal_action(); }).catch(function (reason) {
            console.log(reason);
        });
    };
    IncidentTreatmentModalComponent.prototype.add_comment = function () {
        this.modalService.open(modal_service_1.ModalType.AddIncidentComment, this.current_incident);
    };
    IncidentTreatmentModalComponent.prototype.show_comments = function () {
        this.modalService.open(modal_service_1.ModalType.IncidentCommentList, this.current_incident);
    };
    __decorate([
        core_1.ViewChild('content'),
        __metadata("design:type", core_1.ElementRef)
    ], IncidentTreatmentModalComponent.prototype, "incident_treatment_modal", void 0);
    IncidentTreatmentModalComponent = __decorate([
        core_1.Component({
            selector: 'incident-treatment-modal',
            templateUrl: './incident-treatment-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbDatepickerConfig, typeof (_a = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _a || Object, ng_bootstrap_1.NgbModal, typeof (_b = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _b || Object, typeof (_c = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _c || Object, typeof (_d = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _d || Object])
    ], IncidentTreatmentModalComponent);
    return IncidentTreatmentModalComponent;
    var _a, _b, _c, _d;
}());
exports.IncidentTreatmentModalComponent = IncidentTreatmentModalComponent;
//# sourceMappingURL=incident-treatment-modal.component.js.map