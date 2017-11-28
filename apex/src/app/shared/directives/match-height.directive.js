"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let MatchHeightDirective = class MatchHeightDirective {
    constructor(el) {
        this.el = el;
    }
    ngAfterViewChecked() {
        // call our matchHeight function here
        this.matchHeights(this.el.nativeElement, this.matchHeight);
    }
    matchHeights(parent, className) {
        // match height logic here
        if (!parent)
            return;
        // step 1: find all the child elements with the selected class name
        const children = parent.getElementsByClassName(className);
        if (!children)
            return;
        Array.from(children).forEach((x) => {
            x.style.height = 'initial';
        });
        // step 2a: get all the child elements heights
        const itemHeights = Array.from(children)
            .map(x => x.getBoundingClientRect().height);
        // step 2b: find out the tallest
        const maxHeight = itemHeights.reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        }, 0);
        // step 3: update all the child elements to the tallest height
        Array.from(children)
            .forEach((x) => x.style.height = `${maxHeight}px`);
    }
    onResize() {
        // call our matchHeight function here
        this.matchHeights(this.el.nativeElement, this.matchHeight);
    }
};
__decorate([
    core_1.Input()
], MatchHeightDirective.prototype, "matchHeight", void 0);
__decorate([
    core_1.HostListener('window:resize')
], MatchHeightDirective.prototype, "onResize", null);
MatchHeightDirective = __decorate([
    core_1.Directive({
        selector: '[matchHeight ]'
    })
], MatchHeightDirective);
exports.MatchHeightDirective = MatchHeightDirective;
let MatchHeightModule = class MatchHeightModule {
};
MatchHeightModule = __decorate([
    core_1.NgModule({
        declarations: [MatchHeightDirective],
        exports: [MatchHeightDirective]
    })
], MatchHeightModule);
exports.MatchHeightModule = MatchHeightModule;
//# sourceMappingURL=match-height.directive.js.map