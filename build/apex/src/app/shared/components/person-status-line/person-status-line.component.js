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
var router_1 = require("@angular/router");
var modal_service_1 = require("app/services/modal-service");
var person_service_1 = require("app/services/person-service");
var PersonStatusLineComponent = /** @class */ (function () {
    function PersonStatusLineComponent(route, router, modalService, personService) {
        this.route = route;
        this.router = router;
        this.modalService = modalService;
        this.personService = personService;
        this.hideCommunicationStatus = false;
        this.hideScheduleStatus = false;
        this.hideFinancialStatus = false;
    }
    PersonStatusLineComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.person_changes_subscriber = this.personService.personChanges$
            .filter(function (p) { return p.id == _this.person.id; })
            .subscribe(function (person) {
            _this.person = person;
        });
    };
    PersonStatusLineComponent.prototype.ngOnDestroy = function () {
        this.person_changes_subscriber.unsubscribe();
    };
    PersonStatusLineComponent.prototype.begin_person_data_treatment = function () {
        this.modalService.open(modal_service_1.ModalType.PersonTreatment, this.person);
    };
    PersonStatusLineComponent.prototype.begin_person_comunication_treatment = function () {
        this.modalService.open(modal_service_1.ModalType.PersonComunicationTreatment, this.person);
    };
    PersonStatusLineComponent.prototype.begin_person_financial_treatment = function () {
        this.modalService.open(modal_service_1.ModalType.PersonFinancialTreatment, this.person);
    };
    PersonStatusLineComponent.prototype.begin_person_schedule_treatment = function () {
        this.modalService.open(modal_service_1.ModalType.PersonScheduleTreatment, this.person);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonStatusLineComponent.prototype, "person", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonStatusLineComponent.prototype, "hideCommunicationStatus", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonStatusLineComponent.prototype, "hideScheduleStatus", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonStatusLineComponent.prototype, "hideFinancialStatus", void 0);
    PersonStatusLineComponent = __decorate([
        core_1.Component({
            selector: 'person-status-line',
            templateUrl: './person-status-line.component.html'
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            router_1.Router, typeof (_a = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _a || Object, typeof (_b = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _b || Object])
    ], PersonStatusLineComponent);
    return PersonStatusLineComponent;
    var _a, _b;
}());
exports.PersonStatusLineComponent = PersonStatusLineComponent;
//# sourceMappingURL=person-status-line.component.js.map