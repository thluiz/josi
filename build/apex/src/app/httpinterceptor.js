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
require("rxjs/add/observable/throw");
require("rxjs/add/operator/catch");
var router_1 = require("@angular/router");
var environment_1 = require("../environments/environment");
var ng_application_insights_1 = require("@markpieszak/ng-application-insights");
var SecurityHttpInterceptor = /** @class */ (function () {
    function SecurityHttpInterceptor(router, appInsightsService) {
        this.router = router;
        this.appInsightsService = appInsightsService;
    }
    SecurityHttpInterceptor.prototype.intercept = function (req, next) {
        // Clone the request to add the new header.
        // const authReq = req.clone({ headers: req.headers.set("headerName", "headerValue")});        
        // console.log("Sending request with new header now ...");
        var _this = this;
        return next.handle(req).do(function (event) {
            if (event instanceof http_1.HttpResponse) {
                // do stuff with response if you want
                if (environment_1.environment.production) {
                    _this.appInsightsService.trackEvent(req.url, req.body);
                }
            }
        }, function (err) {
            if (err instanceof http_1.HttpErrorResponse) {
                if (err.status === 401) {
                    window.location.href = environment_1.environment.login_url;
                }
                else {
                    if (environment_1.environment.production) {
                        _this.appInsightsService.trackEvent(req.url, req.body);
                    }
                }
            }
        });
    };
    SecurityHttpInterceptor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, ng_application_insights_1.AppInsightsService])
    ], SecurityHttpInterceptor);
    return SecurityHttpInterceptor;
}());
exports.SecurityHttpInterceptor = SecurityHttpInterceptor;
//# sourceMappingURL=httpinterceptor.js.map