"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
var change_members_view_component_1 = require("./change-members-view.component");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ChangeMembersViewModule = /** @class */ (function () {
    function ChangeMembersViewModule() {
    }
    ChangeMembersViewModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule
            ],
            declarations: [
                change_members_view_component_1.ChangeMembersViewComponent
            ], exports: [
                change_members_view_component_1.ChangeMembersViewComponent
            ]
        })
    ], ChangeMembersViewModule);
    return ChangeMembersViewModule;
}());
exports.ChangeMembersViewModule = ChangeMembersViewModule;
//# sourceMappingURL=change-members-view.module.js.map