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
var utils_service_1 = require("app/services/utils-service");
var parameter_service_1 = require("app/services/parameter-service");
var person_service_1 = require("app/services/person-service");
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datepicker_i18n_1 = require("app/shared/datepicker-i18n");
var PersonEditPageComponent = /** @class */ (function () {
    function PersonEditPageComponent(personService, parameterService, utilsService, route, router, modalService, datePickerConfig) {
        this.personService = personService;
        this.parameterService = parameterService;
        this.utilsService = utilsService;
        this.route = route;
        this.router = router;
        this.modalService = modalService;
        this.datePickerConfig = datePickerConfig;
        datePickerConfig.firstDayOfWeek = 7;
    }
    PersonEditPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = +params['id'];
            _this.load_person_data();
        });
    };
    PersonEditPageComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    PersonEditPageComponent.prototype.open = function (content, incident) {
        this.modalService.open(content).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    PersonEditPageComponent.prototype.change_program = function (program) {
        if (!program || !this.programs) {
            return;
        }
        this.domains = this.programs.filter(function (p) { return p.id == program; })[0].domains;
    };
    PersonEditPageComponent.prototype.save_person_data = function () {
        var _this = this;
        if (!this.validate_person()) {
            return;
        }
        var p = this.person;
        p.birth_date = this.translate_date_to_server(this.person.birth_date);
        p.admission_date = this.translate_date_to_server(this.person.admission_date);
        p.baaisi_date = this.translate_date_to_server(this.person.baaisi_date);
        p.enrollment_date = this.translate_date_to_server(this.person.enrollment_date);
        p.passport_expiration_date = this.translate_date_to_server(this.person.passport_expiration_date);
        this.personService.savePersonData(p).toPromise().then(function () {
            _this.router.navigateByUrl("/people/person/" + _this.id);
        });
    };
    PersonEditPageComponent.prototype.validate_person = function () {
        this.person.errors = this.person.errors || [];
        this.person.is_valid = true;
        if (!this.person.is_active_member) {
            this.person.errors = [];
            return true;
        }
        if (this.person.branch_id > 0 && (!this.person.program_id || this.person.program_id <= 0)) {
            this.person.errors['need_program'] = true;
            this.person.is_valid = false;
        }
        else {
            this.person.errors['need_program'] = false;
        }
        if (this.person.program_id > 0 && (!this.person.domain_id || this.person.domain_id <= 0)) {
            this.person.errors['need_domain'] = true;
            this.person.is_valid = false;
        }
        else {
            this.person.errors['need_domain'] = false;
        }
        if (this.person.is_valid) {
            this.person.errors = [];
            return true;
        }
        return false;
    };
    PersonEditPageComponent.prototype.translate_date_to_view = function (date) {
        return this.utilsService.translate_date_to_view(date);
    };
    PersonEditPageComponent.prototype.translate_date_to_server = function (date) {
        return this.utilsService.translate_date_to_server(date);
    };
    PersonEditPageComponent.prototype.load_person_data = function () {
        var _this = this;
        this.personService.getData(this.id).subscribe(function (data) {
            var result = data;
            _this.person = result;
            _this.person.birth_date = _this.translate_date_to_view(_this.person.birth_date);
            _this.person.admission_date = _this.translate_date_to_view(_this.person.admission_date);
            _this.person.baaisi_date = _this.translate_date_to_view(_this.person.baaisi_date);
            _this.person.enrollment_date = _this.translate_date_to_view(_this.person.enrollment_date);
            _this.person.passport_expiration_date = _this.translate_date_to_view(_this.person.passport_expiration_date);
            if (!(_this.person.is_active_member
                || _this.person.is_disciple
                || _this.person.is_leaving
                || _this.person.is_inactive_member))
                return;
            _this.parameterService.getActiveBranches().subscribe(function (data) { return _this.branches = data; });
            _this.parameterService.getKungFuFamilies().subscribe(function (data) { return _this.families = data; });
            _this.parameterService.getPrograms().subscribe(function (data) {
                _this.programs = data;
                if (_this.person.program_id)
                    _this.domains = _this.programs.filter(function (p) { return p.id == _this.person.program_id; })[0].domains;
            });
        });
    };
    PersonEditPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './person-edit-page.component.html',
            styleUrls: ['./person-edit-page.component.scss'],
            providers: [datepicker_i18n_1.DatePickerI18n,
                { provide: ng_bootstrap_1.NgbDateParserFormatter, useClass: datepicker_i18n_1.NgbDatePTParserFormatter },
                { provide: ng_bootstrap_1.NgbDatepickerI18n, useClass: datepicker_i18n_1.PortugueseDatepicker }]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, typeof (_c = typeof utils_service_1.UtilsService !== "undefined" && utils_service_1.UtilsService) === "function" && _c || Object, router_1.ActivatedRoute,
            router_1.Router,
            ng_bootstrap_1.NgbModal,
            ng_bootstrap_1.NgbDatepickerConfig])
    ], PersonEditPageComponent);
    return PersonEditPageComponent;
    var _a, _b, _c;
}());
exports.PersonEditPageComponent = PersonEditPageComponent;
//# sourceMappingURL=person-edit-page.component.js.map