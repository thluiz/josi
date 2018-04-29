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
var person_comment_list_component_1 = require("./../shared/components/person-comment-list/person-comment-list.component");
var person_partnership_list_component_1 = require("./../shared/components/person-partnership-list/person-partnership-list.component");
var person_contact_list_component_1 = require("./../shared/components/person-contact-list/person-contact-list.component");
var person_external_unit_list_component_1 = require("./../shared/components/person-external-unit-list/person-external-unit-list.component");
var card_service_1 = require("./../../../services/card-service");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var Observable_1 = require("rxjs/Observable");
var person_service_1 = require("./../../../services/person-service");
var parameter_service_1 = require("./../../../services/parameter-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var person_indication_list_component_1 = require("../../../shared/components/person-indication-list/person-indication-list.component");
var PersonPageComponent = /** @class */ (function () {
    function PersonPageComponent(personService, parameterService, cardService, route, modalService, datePickerConfig) {
        this.personService = personService;
        this.parameterService = parameterService;
        this.cardService = cardService;
        this.route = route;
        this.modalService = modalService;
        this.datePickerConfig = datePickerConfig;
        this.new_schedule = {};
        this.branches = [];
        this.countries = [];
        this.addresses = [];
    }
    PersonPageComponent.prototype.ngAfterViewInit = function () {
        if (!this.subs) {
            this.subs = [];
        }
        this.subs.push(this.indicationsComponent.changes.subscribe(function (comps) {
            comps.first.load_indications();
        }));
        this.subs.push(this.externalUnitsComponent.changes.subscribe(function (comps) {
            comps.first.load_items();
        }));
        this.subs.push(this.partnershipComponent.changes.subscribe(function (comps) {
            comps.first.load_items();
        }));
        this.subs.push(this.contactListComponent.changes.subscribe(function (comps) {
            comps.first.load_contacts();
        }));
        this.subs.push(this.commentListComponent.changes.subscribe(function (comps) {
            comps.first.load_comments();
        }));
    };
    PersonPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.subs) {
            this.subs = [];
        }
        this.subs.push(this.route.params.subscribe(function (params) {
            _this.id = +params['id'];
            _this.load_person_data();
            _this.load_person_roles();
            _this.load_person_scheduling();
            _this.load_comments_about_person();
            _this.load_person_address();
        }));
        this.subs.push(this.personService.personChanges$
            .filter(function (data) { return data != null && data.id == _this.id; })
            .subscribe(function (data) {
            _this.person = data;
        }));
        this.reset_new_schedule();
    };
    PersonPageComponent.prototype.ngOnDestroy = function () {
        if (this.subs) {
            this.subs.forEach(function (s) { return s.unsubscribe(); });
        }
    };
    PersonPageComponent.prototype.open_schedule_modal = function (content) {
        var _this = this;
        Observable_1.Observable.zip(this.parameterService.getActiveBranches(), this.parameterService.getIncidentTypes(), this.parameterService.getRecurrenceTypes(), function (branches, incident_types, recurrence_types) {
            _this.branches = branches;
            _this.manual_incident_types = incident_types.filter(function (f) { return !f.automatically_generated; });
            _this.recurrence_types = recurrence_types;
        }).subscribe(function () {
            _this.open(content);
        });
    };
    PersonPageComponent.prototype.open_add_role = function (content) {
        var _this = this;
        this.parameterService.getRoles().subscribe(function (roles) {
            _this.available_roles = roles.filter(function (r) { return !_this.current_roles || _this.current_roles.findIndex(function (cr) { return cr.id == r.id; }) < 0; });
            _this.open(content);
        });
    };
    PersonPageComponent.prototype.open = function (content) {
        this.modalService.open(content).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    PersonPageComponent.prototype.add_role = function () {
        var _this = this;
        this.personService.addRole(this.id, this.new_role).toPromise().then(function () {
            _this.load_person_data();
            _this.load_person_roles();
            _this.cardService.getOperators(true).subscribe();
        });
    };
    PersonPageComponent.prototype.remove_role = function (role_id) {
        var _this = this;
        this.personService.removeRole(this.id, role_id).toPromise().then(function () {
            _this.load_person_data();
            _this.load_person_roles();
            _this.cardService.getOperators(true).subscribe();
        });
    };
    PersonPageComponent.prototype.load_person_scheduling = function () {
        var _this = this;
        this.personService.getPersonScheduling(this.id).subscribe(function (scheduling) {
            _this.current_scheduling = scheduling;
        });
    };
    PersonPageComponent.prototype.load_person_roles = function () {
        var _this = this;
        this.personService.getPersonRoles(this.id).subscribe(function (roles) {
            _this.current_roles = roles;
        });
    };
    PersonPageComponent.prototype.load_person_data = function () {
        var _this = this;
        this.personService.getData(this.id).subscribe(function (data) {
            _this.person = data;
        });
    };
    PersonPageComponent.prototype.begin_remove_schedule = function (schedule) {
        schedule.begin_remove = true;
    };
    PersonPageComponent.prototype.rollback_remove_schedule = function (schedule) {
        schedule.begin_remove = false;
    };
    PersonPageComponent.prototype.remove_schedule = function (schedule) {
        var _this = this;
        this.personService.remove_schedule(schedule)
            .toPromise()
            .then(function () {
            _this.load_person_scheduling();
        });
    };
    PersonPageComponent.prototype.save_schedule = function () {
        var _this = this;
        var start_date = this.new_schedule.start_date_tmp;
        if (start_date) {
            this.new_schedule.start_date = start_date.year + "-" + start_date.month + "-" + start_date.day;
        }
        if (this.new_schedule.time) {
            this.new_schedule.start_hour = this.new_schedule.time.hour;
            this.new_schedule.start_minute = this.new_schedule.time.minute;
        }
        if (this.new_schedule.type) {
            this.new_schedule.incident_type = this.new_schedule.type.id;
        }
        this.personService.save_schedule(this.new_schedule)
            .toPromise()
            .then(function () {
            _this.load_person_scheduling();
            _this.reset_new_schedule();
        });
    };
    PersonPageComponent.prototype.reset_new_schedule = function () {
        this.new_schedule = {
            person_id: this.id
        };
    };
    PersonPageComponent.prototype.reset_new_schedule_type = function () {
        this.new_schedule.type = null;
        this.new_schedule.tmp_combo_type = null;
        this.new_schedule.tmp_type = null;
        this.new_schedule.children_type = null;
        this.validate_new_schedule();
    };
    PersonPageComponent.prototype.change_new_schedule_type = function (tp) {
        var t = this.manual_incident_types.filter(function (t) { return t.id == tp; });
        if (t.length != 1) {
            return;
        }
        var type = t[0];
        if (type.childrens != null) {
            this.new_schedule.type = null;
            this.new_schedule.tmp_type = type;
            this.new_schedule.correct = false;
        }
        else {
            this.new_schedule.tmp_type = type;
            this.new_schedule.type = type;
        }
    };
    PersonPageComponent.prototype.change_new_schedule_children_type = function (tp) {
        var t = this.new_schedule.tmp_type.childrens.filter(function (t) { return t.id == tp; });
        if (t.length != 1) {
            return;
        }
        var type = t[0];
        this.new_schedule.children_type = type;
        this.new_schedule.type = type;
    };
    PersonPageComponent.prototype.validate_new_schedule = function () {
        this.new_schedule.correct = false;
        var schedule = this.new_schedule;
        if (parseInt(schedule.person_id, 10) > 0
            && parseInt(schedule.branch_id, 10) > 0
            && schedule.type != null
            && parseInt(schedule.recurrence_type, 10) > 0
            && parseInt(schedule.number_of_incidents, 10) > 0
            && schedule.start_date_tmp != null) {
            if (schedule.type.need_value
                && (!schedule.value || schedule.value <= 0)) {
                return;
            }
            if (schedule.type.need_start_hour_minute && !schedule.time) {
                return;
            }
            this.new_schedule.correct = true;
        }
    };
    PersonPageComponent.prototype.validate_new_schedule_value = function () {
        if (parseFloat(this.new_schedule.value) != NaN) {
            this.validate_new_schedule();
            return;
        }
        this.new_schedule.value = 0;
        this.validate_new_schedule();
    };
    /**
     * COMMENTS
     */
    PersonPageComponent.prototype.load_comments_about_person = function () {
        var _this = this;
        this.personService.getCommentsAboutPerson(this.id).subscribe(function (comments) {
            _this.comments = comments;
        });
    };
    /**
     * ADDRESS
     */
    PersonPageComponent.prototype.load_person_address = function () {
        var _this = this;
        this.personService.getAddresses(this.id).subscribe(function (data) {
            _this.addresses = data;
        });
    };
    PersonPageComponent.prototype.open_address_modal = function (content) {
        var _this = this;
        this.new_address = {
            country_id: 1,
            city: 'Rio de Janeiro',
            state: 'Rio de Janeiro',
            person_id: this.id
        };
        Observable_1.Observable.zip(this.parameterService.getCountries(), function (countries, incident_types, recurrence_types) {
            _this.countries = countries;
        }).subscribe(function () {
            _this.open(content);
        });
    };
    PersonPageComponent.prototype.validate_new_address = function () {
        var errors = [];
        if (!this.new_address.country_id || this.new_address.country_id <= 0) {
            errors[errors.length] = "Selecione o país";
        }
        if (!this.new_address.state || this.new_address.state.length < 3) {
            errors[errors.length] = "Informe o estado";
        }
        if (!this.new_address.city || this.new_address.city.length < 3) {
            errors[errors.length] = "Informe a cidade";
        }
        if (!this.new_address.street || this.new_address.street.length < 3) {
            errors[errors.length] = "Informe a Rua";
        }
        this.new_address.correct = errors.length == 0;
        this.new_address.errors = errors;
    };
    PersonPageComponent.prototype.save_address = function () {
        var _this = this;
        this.new_address.saving = true;
        this.personService.saveAddress(this.new_address).subscribe(function (data) {
            _this.new_address.saving = false;
            _this.load_person_address();
        });
    };
    PersonPageComponent.prototype.remove_address = function (ad) {
        var _this = this;
        this.personService.archiveAddress(ad).subscribe(function (data) {
            _this.load_person_address();
        });
    };
    __decorate([
        core_1.ViewChildren(person_indication_list_component_1.PersonIndicationListComponent),
        __metadata("design:type", core_1.QueryList)
    ], PersonPageComponent.prototype, "indicationsComponent", void 0);
    __decorate([
        core_1.ViewChildren(person_external_unit_list_component_1.PersonExternalUnitListComponent),
        __metadata("design:type", core_1.QueryList)
    ], PersonPageComponent.prototype, "externalUnitsComponent", void 0);
    __decorate([
        core_1.ViewChildren(person_contact_list_component_1.PersonContactListComponent),
        __metadata("design:type", core_1.QueryList)
    ], PersonPageComponent.prototype, "contactListComponent", void 0);
    __decorate([
        core_1.ViewChildren(person_partnership_list_component_1.PersonPartnershipListComponent),
        __metadata("design:type", core_1.QueryList)
    ], PersonPageComponent.prototype, "partnershipComponent", void 0);
    __decorate([
        core_1.ViewChildren(person_comment_list_component_1.PersonCommentListComponent),
        __metadata("design:type", core_1.QueryList)
    ], PersonPageComponent.prototype, "commentListComponent", void 0);
    PersonPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './person-page.component.html',
            styleUrls: ['../people-customizations.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [person_service_1.PersonService,
            parameter_service_1.ParameterService,
            card_service_1.CardService,
            router_1.ActivatedRoute,
            ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbDatepickerConfig])
    ], PersonPageComponent);
    return PersonPageComponent;
}());
exports.PersonPageComponent = PersonPageComponent;
//# sourceMappingURL=person-page.component.js.map