"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var move_card_modal_component_1 = require("app/shared/components/move-card-modal/move-card-modal.component");
var MoveCardModalModule = /** @class */ (function () {
    function MoveCardModalModule() {
    }
    MoveCardModalModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                ng_bootstrap_1.NgbModule
            ],
            declarations: [
                move_card_modal_component_1.MoveCardModalComponent
            ], exports: [
                move_card_modal_component_1.MoveCardModalComponent
            ]
        })
    ], MoveCardModalModule);
    return MoveCardModalModule;
}());
exports.MoveCardModalModule = MoveCardModalModule;
//# sourceMappingURL=move-card-modal.module.js.map