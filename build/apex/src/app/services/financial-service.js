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
var utils_service_1 = require("./utils-service");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var FinancialService = /** @class */ (function () {
    function FinancialService(http, utilsService) {
        this.http = http;
        this.utilsService = utilsService;
        this.dataUrl = environment_1.environment.api_url;
    }
    FinancialService.prototype.getBranchAccounts = function (branch_id) {
        return this.http.get(this.dataUrl + ("/financial/accounts/" + branch_id));
    };
    FinancialService.prototype.getAccounts = function () {
        return this.http.get(this.dataUrl + "/financial/accounts");
    };
    FinancialService.prototype.saveAccount = function (account) {
        return this.http
            .post(this.dataUrl + "/financial/accounts", {
            account: account
        });
    };
    FinancialService.prototype.getExpectedPayments = function (account_id, start_date, end_date) {
        var url = this.dataUrl + ("/financial_board/expected_payments/" + account_id + "?");
        url = this.concatenate_dates(url, start_date, end_date);
        return this.http.get(url);
    };
    FinancialService.prototype.getMissingPayments = function (account_id, start_date, end_date) {
        var url = this.dataUrl + ("/financial_board/missing_payments/" + account_id + "?");
        url = this.concatenate_dates(url, start_date, end_date);
        return this.http.get(url);
    };
    FinancialService.prototype.getAccountStatus = function (account_id, start_date, end_date) {
        var url = this.dataUrl + ("/financial_board/account_status/" + account_id + "?");
        url = this.concatenate_dates(url, start_date, end_date);
        return this.http.get(url);
    };
    FinancialService.prototype.concatenate_dates = function (url, start_date, end_date) {
        if (start_date) {
            url += "start=" + start_date.getFullYear() + "-" + (start_date.getMonth() + 1) + "-" + start_date.getDate();
        }
        if (start_date && end_date) {
            url += "&";
        }
        if (end_date) {
            url += "end=" + end_date.getFullYear() + "-" + (end_date.getMonth() + 1) + "-" + end_date.getDate();
        }
        return url;
    };
    FinancialService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, utils_service_1.UtilsService])
    ], FinancialService);
    return FinancialService;
}());
exports.FinancialService = FinancialService;
//# sourceMappingURL=financial-service.js.map