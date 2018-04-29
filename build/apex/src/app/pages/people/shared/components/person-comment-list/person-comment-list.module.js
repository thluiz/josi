"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var person_comment_list_component_1 = require("./person-comment-list.component");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var new_contact_form_module_1 = require("app/shared/components/new-contact-form/new-contact-form.module");
var contact_listitem_module_1 = require("app/shared/components/contact-listitem/contact-listitem.module");
var ngx_markdown_1 = require("ngx-markdown");
var PersonCommentListModule = /** @class */ (function () {
    function PersonCommentListModule() {
    }
    PersonCommentListModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                new_contact_form_module_1.NewContactFormModule,
                contact_listitem_module_1.ContactListitemModule,
                ngx_markdown_1.MarkdownModule.forRoot()
            ],
            declarations: [
                person_comment_list_component_1.PersonCommentListComponent
            ], exports: [
                person_comment_list_component_1.PersonCommentListComponent
            ]
        })
    ], PersonCommentListModule);
    return PersonCommentListModule;
}());
exports.PersonCommentListModule = PersonCommentListModule;
//# sourceMappingURL=person-comment-list.module.js.map