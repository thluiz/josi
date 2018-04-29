"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var task_treatment_card_component_1 = require("./task-treatment-card.component");
var person_card_module_1 = require("./../person-card/person-card.module");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var TaskTreatmentCardModule = /** @class */ (function () {
    function TaskTreatmentCardModule() {
    }
    TaskTreatmentCardModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule,
                person_card_module_1.PersonCardModule
            ],
            declarations: [
                task_treatment_card_component_1.TaskTreatmentCardComponent
            ], exports: [
                task_treatment_card_component_1.TaskTreatmentCardComponent
            ]
        })
    ], TaskTreatmentCardModule);
    return TaskTreatmentCardModule;
}());
exports.TaskTreatmentCardModule = TaskTreatmentCardModule;
//# sourceMappingURL=task-treatment-card.module.js.map