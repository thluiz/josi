webpackJsonp(["changelog.module"],{

/***/ "../../../../../src/app/changelog/changelog-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChangeLogRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__changelog_component__ = __webpack_require__("../../../../../src/app/changelog/changelog.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_2__changelog_component__["a" /* ChangeLogComponent */],
        data: {
            title: 'ChangeLog'
        },
    }
];
var ChangeLogRoutingModule = (function () {
    function ChangeLogRoutingModule() {
    }
    ChangeLogRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NgModule */])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */]],
        })
    ], ChangeLogRoutingModule);
    return ChangeLogRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/changelog/changelog.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row\" matchHeight =\"card\">\r\n\t<div class=\"col-12\">\r\n\t\t<div class=\"card\">\r\n\t\t\t<div class=\"card-header\">\r\n\t\t\t\t<h4 class=\"card-title\">Version 1.0</h4>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"card-body\">\r\n\t\t\t\t<div class=\"card-block\">\r\n\t\t\t\t\t<ol>\r\n\t\t\t\t\t\t<li>Initial Release</li>\r\n\t\t\t\t\t</ol>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<div class=\"row\" matchHeight =\"card\">\r\n\t<div class=\"col-12\">\r\n\t\t<div class=\"card\">\r\n\t\t\t<div class=\"card-header\">\r\n\t\t\t\t<h4 class=\"card-title\">Version 2.0</h4>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"card-body\">\r\n\t\t\t\t<div class=\"card-block\">\r\n\t\t\t\t\t<h5 class=\"my-2\">11-10-2017 [2.0]</h5>\r\n\t\t\t\t\t<h3>Added</h3>\r\n\t\t\t\t\t<ol>\r\n\t\t\t\t\t\t<li>Taskboard</li>\r\n\t\t\t\t\t\t<li>Audio Player</li>\r\n\t\t\t\t\t\t<li>Video Player</li>\r\n\t\t\t\t\t\t<li>Chat - Audio & Video</li>\r\n\t\t\t\t\t\t<li>Drag n Drop</li>\r\n\t\t\t\t\t\t<li>Tour</li>\r\n\t\t\t\t\t</ol>\r\n\t\t\t\t\t<h3>Updated</h3>\r\n\t\t\t\t\t<ol>\r\n\t\t\t\t\t\t<li>Updated to Angular 5+</li>\r\n\t\t\t\t\t\t<li>Updated starter kit to Angular 5+</li>\r\n\t\t\t\t\t\t<li>Documentation</li>\r\n\t\t\t\t\t\t<li>Calendar</li>\r\n\t\t\t\t\t\t<li>Sweet Alert</li>\r\n\t\t\t\t\t\t<li>Data Tables</li>\r\n\t\t\t\t\t\t<li>Quill Editor</li>\r\n\t\t\t\t\t</ol>\r\n\t\t\t\t\t<h3>Fixed</h3>\r\n\t\t\t\t\t<ol>\r\n\t\t\t\t\t\t<li>Minor Bugs & design flaws</li>\r\n\t\t\t\t\t</ol>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<div class=\"row\" matchHeight =\"card\">\r\n\t<div class=\"col-12\">\r\n\t\t<div class=\"card\">\r\n\t\t\t<div class=\"card-header\">\r\n\t\t\t\t<h4 class=\"card-title\">Version 2.1</h4>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"card-body\">\r\n\t\t\t\t<div class=\"card-block\">\r\n\t\t\t\t\t<h5 class=\"my-2\">11-21-2017 [2.1]</h5>\r\n\t\t\t\t\t<h3>Added</h3>\r\n\t\t\t\t\t<ol>\r\n\t\t\t\t\t\t<li>Search Page</li>\r\n\t\t\t\t\t\t<li>FAQ Page</li>\r\n\t\t\t\t\t\t<li>Knowledge Base Page</li>\r\n\t\t\t\t\t\t<li>Internationalization (i18n) Support</li>\r\n\t\t\t\t\t\t<li>Authentication Service</li>\r\n\t\t\t\t\t</ol>\r\n\t\t\t\t\t<h3>Updated</h3>\r\n\t\t\t\t\t<ol>\r\n\t\t\t\t\t\t<li>Angular Version (5.0.2)</li>\r\n\t\t\t\t\t\t<li>starter kit</li>\r\n\t\t\t\t\t\t<li>Documentation</li>\r\n\t\t\t\t\t\t<li>Calendar</li>\r\n\t\t\t\t\t\t<li>Inbox</li>\r\n\t\t\t\t\t\t<li>Chat</li>\r\n\t\t\t\t\t\t<li>NGX Datatable</li>\r\n\t\t\t\t\t\t<li>NGX Charts</li>\r\n\t\t\t\t\t</ol>\r\n\t\t\t\t\t<h3>Fixed</h3>\r\n\t\t\t\t\t<ol>\r\n\t\t\t\t\t\t<li>Minor Bugs</li>\r\n\t\t\t\t\t</ol>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/changelog/changelog.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/changelog/changelog.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChangeLogComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ChangeLogComponent = (function () {
    function ChangeLogComponent() {
    }
    ChangeLogComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-changelog',
            template: __webpack_require__("../../../../../src/app/changelog/changelog.component.html"),
            styles: [__webpack_require__("../../../../../src/app/changelog/changelog.component.scss")]
        })
    ], ChangeLogComponent);
    return ChangeLogComponent;
}());



/***/ }),

/***/ "../../../../../src/app/changelog/changelog.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChangeLogModule", function() { return ChangeLogModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__changelog_routing_module__ = __webpack_require__("../../../../../src/app/changelog/changelog-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_directives_match_height_directive__ = __webpack_require__("../../../../../src/app/shared/directives/match-height.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__changelog_component__ = __webpack_require__("../../../../../src/app/changelog/changelog.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var ChangeLogModule = (function () {
    function ChangeLogModule() {
    }
    ChangeLogModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_2__changelog_routing_module__["a" /* ChangeLogRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_3__shared_directives_match_height_directive__["a" /* MatchHeightModule */]
            ],
            exports: [],
            declarations: [__WEBPACK_IMPORTED_MODULE_4__changelog_component__["a" /* ChangeLogComponent */]],
            providers: [],
        })
    ], ChangeLogModule);
    return ChangeLogModule;
}());



/***/ }),

/***/ "../../../../../src/app/shared/directives/match-height.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MatchHeightDirective */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MatchHeightModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MatchHeightDirective = (function () {
    function MatchHeightDirective(el) {
        this.el = el;
    }
    MatchHeightDirective.prototype.ngAfterViewChecked = function () {
        // call our matchHeight function here
        this.matchHeights(this.el.nativeElement, this.matchHeight);
    };
    MatchHeightDirective.prototype.matchHeights = function (parent, className) {
        // match height logic here
        if (!parent)
            return;
        // step 1: find all the child elements with the selected class name
        var children = parent.getElementsByClassName(className);
        if (!children)
            return;
        Array.from(children).forEach(function (x) {
            x.style.height = 'initial';
        });
        // step 2a: get all the child elements heights
        var itemHeights = Array.from(children)
            .map(function (x) { return x.getBoundingClientRect().height; });
        // step 2b: find out the tallest
        var maxHeight = itemHeights.reduce(function (prev, curr) {
            return curr > prev ? curr : prev;
        }, 0);
        // step 3: update all the child elements to the tallest height
        Array.from(children)
            .forEach(function (x) { return x.style.height = maxHeight + "px"; });
    };
    MatchHeightDirective.prototype.onResize = function () {
        // call our matchHeight function here
        this.matchHeights(this.el.nativeElement, this.matchHeight);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], MatchHeightDirective.prototype, "matchHeight", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostListener */])('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MatchHeightDirective.prototype, "onResize", null);
    MatchHeightDirective = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* Directive */])({
            selector: '[matchHeight ]'
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */]])
    ], MatchHeightDirective);
    return MatchHeightDirective;
}());

var MatchHeightModule = (function () {
    function MatchHeightModule() {
    }
    MatchHeightModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NgModule */])({
            declarations: [MatchHeightDirective],
            exports: [MatchHeightDirective]
        })
    ], MatchHeightModule);
    return MatchHeightModule;
}());



/***/ })

});
//# sourceMappingURL=changelog.module.chunk.js.map