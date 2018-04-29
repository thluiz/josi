"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ng_bootstrap_2 = require("@ng-bootstrap/ng-bootstrap");
var I18N_VALUES = {
    'pt': {
        weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
        months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    }
};
// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
var DatePickerI18n = /** @class */ (function () {
    function DatePickerI18n() {
        this.language = 'pt';
    }
    DatePickerI18n = __decorate([
        core_1.Injectable()
    ], DatePickerI18n);
    return DatePickerI18n;
}());
exports.DatePickerI18n = DatePickerI18n;
function padNumber(value) {
    if (isNumber(value)) {
        return ("0" + value).slice(-2);
    }
    else {
        return "";
    }
}
function isNumber(value) {
    return !isNaN(toInteger(value));
}
function toInteger(value) {
    return parseInt("" + value, 10);
}
// Define custom service providing the months and weekdays translations
var PortugueseDatepicker = /** @class */ (function (_super) {
    __extends(PortugueseDatepicker, _super);
    function PortugueseDatepicker(_i18n) {
        var _this = _super.call(this) || this;
        _this._i18n = _i18n;
        return _this;
    }
    PortugueseDatepicker.prototype.getWeekdayShortName = function (weekday) {
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    };
    PortugueseDatepicker.prototype.getMonthShortName = function (month) {
        return I18N_VALUES[this._i18n.language].months[month - 1];
    };
    PortugueseDatepicker.prototype.getMonthFullName = function (month) {
        return this.getMonthShortName(month);
    };
    PortugueseDatepicker = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [DatePickerI18n])
    ], PortugueseDatepicker);
    return PortugueseDatepicker;
}(ng_bootstrap_1.NgbDatepickerI18n));
exports.PortugueseDatepicker = PortugueseDatepicker;
var NgbDatePTParserFormatter = /** @class */ (function (_super) {
    __extends(NgbDatePTParserFormatter, _super);
    function NgbDatePTParserFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NgbDatePTParserFormatter.prototype.parse = function (value) {
        if (value) {
            var dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[1]), month: toInteger(dateParts[0]), day: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0]) };
            }
        }
        return null;
    };
    NgbDatePTParserFormatter.prototype.format = function (date) {
        var stringDate = "";
        if (date) {
            stringDate += isNumber(date.day) ? padNumber(date.day) + "/" : "";
            stringDate += isNumber(date.month) ? padNumber(date.month) + "/" : "";
            stringDate += date.year;
        }
        return stringDate;
    };
    NgbDatePTParserFormatter = __decorate([
        core_1.Injectable()
    ], NgbDatePTParserFormatter);
    return NgbDatePTParserFormatter;
}(ng_bootstrap_2.NgbDateParserFormatter));
exports.NgbDatePTParserFormatter = NgbDatePTParserFormatter;
//# sourceMappingURL=datepicker-i18n.js.map