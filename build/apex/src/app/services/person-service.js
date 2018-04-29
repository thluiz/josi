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
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var Subject_1 = require("rxjs/Subject");
var DailyMonitorDisplayType;
(function (DailyMonitorDisplayType) {
    DailyMonitorDisplayType[DailyMonitorDisplayType["Week"] = 0] = "Week";
    DailyMonitorDisplayType[DailyMonitorDisplayType["Day"] = 1] = "Day";
    DailyMonitorDisplayType[DailyMonitorDisplayType["Month"] = 2] = "Month";
    DailyMonitorDisplayType[DailyMonitorDisplayType["Agenda"] = 3] = "Agenda";
    DailyMonitorDisplayType[DailyMonitorDisplayType["Current"] = 4] = "Current";
})(DailyMonitorDisplayType = exports.DailyMonitorDisplayType || (exports.DailyMonitorDisplayType = {}));
var PersonActions;
(function (PersonActions) {
    PersonActions[PersonActions["ADD"] = 0] = "ADD";
    PersonActions[PersonActions["ADD_ADDRESS"] = 1] = "ADD_ADDRESS";
    PersonActions[PersonActions["ARCHIVE_ADDRESS"] = 2] = "ARCHIVE_ADDRESS";
})(PersonActions = exports.PersonActions || (exports.PersonActions = {}));
var PersonService = /** @class */ (function () {
    function PersonService(http) {
        this.http = http;
        this.dataUrl = environment_1.environment.api_url;
        this.contact_changes = new Subject_1.Subject();
        this.contactChanges$ = this.contact_changes.asObservable();
        this.person_changes = new Subject_1.Subject();
        this.personChanges$ = this.person_changes.asObservable();
        this.comment_changes = new Subject_1.Subject();
        this.commentChanges$ = this.comment_changes.asObservable();
        this.person_actions = new Subject_1.Subject();
        this.personActions$ = this.person_actions.asObservable();
        this.indication_actions = new Subject_1.Subject();
        this.indicationChanges$ = this.indication_actions.asObservable();
        this.partnership_actions = new Subject_1.Subject();
        this.partnershipChanges$ = this.partnership_actions.asObservable();
        this.external_unit_actions = new Subject_1.Subject();
        this.externalUnitChanges$ = this.external_unit_actions.asObservable();
    }
    PersonService.prototype.getDailyAgenda = function (branch, date) {
        return this.http.get(this.dataUrl + ("/agenda/" + (branch || 0) + "/" + date.year + "-" + date.month + "-" + date.day));
    };
    PersonService.prototype.getDailyMonitor = function (branch, display, display_modifier) {
        return this.http.get(this.dataUrl + ("/daily/" + (branch || 0) + "/" + display + "/" + display_modifier));
    };
    PersonService.prototype.getPeopleSummary = function (branche, week) {
        return this.http.get(this.dataUrl + ("/people_summary/" + (branche || 0) + "/" + week));
    };
    PersonService.prototype.getMembersList = function () {
        return this.http.get(this.dataUrl + "/people/members");
    };
    PersonService.prototype.getInterestedList = function (branch, name) {
        return this.http.get(this.dataUrl + ("/interested?branch=" + (branch || 0) + "&name=" + (name || "")));
    };
    PersonService.prototype.getVoucherPeopleList = function (branch, name, voucher) {
        return this.http.get(this.dataUrl + ("/voucher_people?branch=" + (branch || 0) + "&name=" + (name || "") + "&voucher=" + (voucher || 0)));
    };
    PersonService.prototype.getInvitedPeopleList = function (branch, name, voucher) {
        return this.http.get(this.dataUrl + ("/invited_people?branch=" + (branch || 0) + "&name=" + (name || "") + "&voucher=" + (voucher || 0)));
    };
    PersonService.prototype.getPeopleAwayList = function (branch, name) {
        return this.http.get(this.dataUrl + ("/people-away?branch=" + (branch || 0) + "&name=" + (name || "")));
    };
    PersonService.prototype.getServiceProvidersList = function (branch, name) {
        return this.http.get(this.dataUrl + ("/service-providers?branch=" + (branch || 0) + "&name=" + (name || "")));
    };
    PersonService.prototype.getPeopleList = function () {
        return this.http.get(this.dataUrl + "/people");
    };
    PersonService.prototype.getPersonContacts = function (person_id, only_principal) {
        if (only_principal === void 0) { only_principal = false; }
        return this.http.get(this.dataUrl + ("/person_contact/person/" + person_id + "/" + (only_principal ? 1 : 0)));
    };
    PersonService.prototype.getPersonPartnerships = function (person_id) {
        return this.http.get(this.dataUrl + ("/person_partnerships/person/" + person_id));
    };
    PersonService.prototype.getPersonExternalUnits = function (person_id) {
        return this.http.get(this.dataUrl + ("/person_external_units/person/" + person_id));
    };
    PersonService.prototype.getPersonIndications = function (person_id) {
        return this.http.get(this.dataUrl + ("/person_indications/person/" + person_id));
    };
    PersonService.prototype.getPendingCommunication = function (person_id) {
        return this.http.get(this.dataUrl + ("/person_communication/pending/" + person_id));
    };
    PersonService.prototype.getPendingFinancial = function (person_id) {
        return this.http.get(this.dataUrl + ("/person_financial/pending/" + person_id));
    };
    PersonService.prototype.getPendingSchedule = function (person_id) {
        return this.http.get(this.dataUrl + ("/person_schedule/pending/" + person_id));
    };
    PersonService.prototype.getPersonMissingData = function (person_id) {
        return this.http.get(this.dataUrl + ("/person/missing_data/" + person_id));
    };
    PersonService.prototype.saveIndication = function (indication) {
        var _this = this;
        return this.http.post(this.dataUrl + "/person_indications", { indication: indication }).do(function (d) {
            _this.indication_actions.next(indication);
        });
    };
    PersonService.prototype.savePartnership = function (partnership) {
        var _this = this;
        return this.http.post(this.dataUrl + "/person_partnerships", { partnership: partnership }).do(function (d) {
            _this.partnership_actions.next(partnership);
        });
    };
    PersonService.prototype.saveExternalUnit = function (external_unit) {
        var _this = this;
        return this.http.post(this.dataUrl + "/person_external_units", { external_unit: external_unit }).do(function (d) {
            _this.external_unit_actions.next(external_unit);
        });
    };
    PersonService.prototype.savePersonContact = function (person_id, contact_type, contact, details, principal) {
        var _this = this;
        var contact_data = {
            person_id: person_id,
            contact_type: contact_type,
            contact: contact,
            details: details,
            principal: principal
        };
        return this.http.post(this.dataUrl + "/person_contact", contact_data).do(function (d) {
            _this.contact_changes.next(contact_data);
        });
    };
    PersonService.prototype.savePersonData = function (person) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/people", {
            person: person
        }).do(function (data) {
            _this.person_changes.next(data);
        });
    };
    PersonService.prototype.registerPerson = function (person) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/person", {
            person: person
        }).do(function (data) {
            _this.person_actions.next({
                type: PersonActions.ADD,
                data: data
            });
        });
    };
    PersonService.prototype.removePersonContact = function (person_id, contact_id) {
        var _this = this;
        return this.http.post(this.dataUrl + "/person_contact/remove", {
            contact_id: contact_id
        }).do(function (data) {
            _this.contact_changes.next({ person_id: person_id });
        });
    };
    PersonService.prototype.getData = function (id) {
        return this.http
            .get(this.dataUrl + ("/people/" + id));
    };
    PersonService.prototype.getPersonRoles = function (id) {
        return this.http
            .get(this.dataUrl + ("/person_role/person/" + id));
    };
    PersonService.prototype.getAddresses = function (id) {
        return this.http
            .get(this.dataUrl + ("/person_address/" + id));
    };
    PersonService.prototype.getPersonScheduling = function (id) {
        return this.http
            .get(this.dataUrl + ("/person_schedule/person/" + id));
    };
    PersonService.prototype.addRole = function (person_id, role_id) {
        return this.http
            .post(this.dataUrl + "/person_role", {
            person_id: person_id, role_id: role_id
        });
    };
    PersonService.prototype.removeRole = function (person_id, role_id) {
        return this.http
            .post(this.dataUrl + "/person_role/delete", {
            person_id: person_id, role_id: role_id
        });
    };
    PersonService.prototype.saveKFName = function (person_id, kf_name, ideograms) {
        return this.http
            .post(this.dataUrl + "/people_alias/kf_name", {
            person_id: person_id,
            kf_name: kf_name,
            ideograms: ideograms
        });
    };
    PersonService.prototype.search = function (name) {
        return this.http
            .get(this.dataUrl + ("/people/search/" + name));
    };
    PersonService.prototype.remove_schedule = function (schedule) {
        return this.http
            .post(this.dataUrl + "/person_schedule/delete", {
            id: schedule.id
        });
    };
    PersonService.prototype.save_schedule = function (schedule) {
        return this.http
            .post(this.dataUrl + "/person_schedule", {
            schedule: schedule
        });
    };
    PersonService.prototype.getCommentsAboutPerson = function (person_id) {
        return this.http.get(this.dataUrl + ("/people_comments/about/" + person_id));
    };
    PersonService.prototype.archiveComment = function (comment, person) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/people_comments/archive", {
            id: comment.id
        }).do(function (data) {
            _this.comment_changes.next({ person: person });
        });
    };
    PersonService.prototype.saveAddress = function (address) {
        var _this = this;
        return this.http.post(this.dataUrl + "/person_address", { address: address }).do(function (data) {
            _this.person_actions.next({
                type: PersonActions.ADD_ADDRESS,
                data: data
            });
        });
    };
    PersonService.prototype.archiveAddress = function (person_address) {
        var _this = this;
        return this.http.post(this.dataUrl + "/person_address/archive", { person_address: person_address }).do(function (data) {
            _this.person_actions.next({
                type: PersonActions.ARCHIVE_ADDRESS,
                data: data
            });
        });
    };
    PersonService.prototype.saveCommentAboutPerson = function (person, comment) {
        var _this = this;
        return this.http
            .post(this.dataUrl + "/people_comments/about", {
            person_id: person.id,
            comment: comment
        }).do(function (data) {
            _this.comment_changes.next({ person: person });
        });
    };
    PersonService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], PersonService);
    return PersonService;
}());
exports.PersonService = PersonService;
//# sourceMappingURL=person-service.js.map