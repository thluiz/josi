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
var parameter_service_1 = require("app/services/parameter-service");
var person_service_1 = require("app/services/person-service");
var modal_service_1 = require("app/services/modal-service");
var ngx_markdown_1 = require("ngx-markdown");
var PersonCommentListComponent = /** @class */ (function () {
    function PersonCommentListComponent(modalService, parameterService, personService, markdownService) {
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.personService = personService;
        this.markdownService = markdownService;
    }
    PersonCommentListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.comment_changes_subscriber = this.personService.commentChanges$
            .filter(function (data) {
            return data != null && data.person.id == _this.person.id;
        })
            .subscribe(function (data) {
            _this.load_comments();
        });
        this.markdownService.renderer.paragraph = function (text) {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return "<p style=\"margin-bottom:0\">" + text + "</p>";
        };
        this.load_comments();
    };
    PersonCommentListComponent.prototype.ngOnDestroy = function () {
        this.comment_changes_subscriber.unsubscribe();
    };
    PersonCommentListComponent.prototype.load_comments = function () {
        var _this = this;
        if (this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents())) {
            return;
        }
        this.personService.getCommentsAboutPerson(this.person.id)
            .subscribe(function (data) { return _this.comments = data; });
        this.last_call = new Date();
    };
    PersonCommentListComponent.prototype.add_comment = function () {
        this.modalService.open(modal_service_1.ModalType.AddPersonComment, this.person);
    };
    PersonCommentListComponent.prototype.archive_comment = function (comment) {
        this.personService.archiveComment(comment, this.person).subscribe();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PersonCommentListComponent.prototype, "person", void 0);
    PersonCommentListComponent = __decorate([
        core_1.Component({
            selector: 'person-comment-list',
            templateUrl: './person-comment-list.component.html',
            styleUrls: ['./person-comment-list.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _a || Object, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, typeof (_c = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _c || Object, ngx_markdown_1.MarkdownService])
    ], PersonCommentListComponent);
    return PersonCommentListComponent;
    var _a, _b, _c;
}());
exports.PersonCommentListComponent = PersonCommentListComponent;
//# sourceMappingURL=person-comment-list.component.js.map