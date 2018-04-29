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
var platform_browser_1 = require("@angular/platform-browser");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var UtilsService = /** @class */ (function () {
    function UtilsService(sanitizer, http) {
        this.sanitizer = sanitizer;
        this.http = http;
        this.dataUrl = environment_1.environment.api_url;
    }
    UtilsService.prototype.translate_date_to_server = function (date) {
        if (!date || !date.year)
            return null;
        return date.year + "-" + date.month + "-" + date.day;
    };
    UtilsService.prototype.translate_date_time_to_server = function (date, time) {
        if (!date || !date.year || !time)
            return null;
        return date.year + "-" + date.month + "-" + date.day + " " + time.hour + ":" + time.minute;
    };
    UtilsService.prototype.sanitize = function (url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    };
    UtilsService.prototype.translate_date_to_view = function (date) {
        if (!date || date.year > 0 || date.split("-").length != 3) {
            return null;
        }
        var splitted_date = date.split("-");
        if (splitted_date.length < 3) {
            return null;
        }
        return {
            year: parseInt(splitted_date[0], 10),
            month: parseInt(splitted_date[1], 10),
            day: parseInt(splitted_date[2], 10)
        };
    };
    UtilsService.prototype.translate_time_to_view = function (date) {
        if (!date || date.year > 0 || date.split("-").length != 3 || date.split("T").length != 2) {
            return null;
        }
        var splitted_date = date.split("T");
        var time = splitted_date[1].split(":");
        if (time.length < 2) {
            return null;
        }
        return {
            hour: parseInt(time[0], 10),
            minute: parseInt(time[1], 10),
            second: 0
        };
    };
    UtilsService.prototype.cache_results = function (observable, endpoint, forceRefresh) {
        if (!observable.observers.length || forceRefresh) {
            this.http.get(this.dataUrl + endpoint)
                .subscribe(function (data) { return observable.next(data); }, function (error) {
                observable.error(error);
                // Recreate the Observable as after Error we cannot emit data anymore
                observable = new rxjs_1.ReplaySubject(1);
            });
        }
        return observable;
    };
    UtilsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [platform_browser_1.DomSanitizer, http_1.HttpClient])
    ], UtilsService);
    return UtilsService;
}());
exports.UtilsService = UtilsService;
//# sourceMappingURL=utils-service.js.map