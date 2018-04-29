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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var modal_service_1 = require("app/services/modal-service");
var ngx_markdown_1 = require("ngx-markdown");
var incident_service_1 = require("app/services/incident-service");
var IncidentCommentsListModalComponent = /** @class */ (function () {
    function IncidentCommentsListModalComponent(modalService, parameterService, incidentService, markdownService, ngbModalService) {
        this.modalService = modalService;
        this.parameterService = parameterService;
        this.incidentService = incidentService;
        this.markdownService = markdownService;
        this.ngbModalService = ngbModalService;
    }
    IncidentCommentsListModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.comment_changes_subscriber = this.incidentService.commentChanges$
            .filter(function (data) {
            return data != null
                && _this.incident != null
                && data.id == _this.incident.id;
        })
            .subscribe(function (data) {
            _this.load_comments();
        });
        this.markdownService.renderer.paragraph = function (text) {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return "<p style=\"margin-bottom:0\">" + text + "</p>";
        };
        if (this.incident) {
            this.load_comments();
        }
    };
    IncidentCommentsListModalComponent.prototype.ngOnDestroy = function () {
        this.comment_changes_subscriber.unsubscribe();
    };
    IncidentCommentsListModalComponent.prototype.open = function (incident) {
        var _this = this;
        this.incident = incident;
        this.incidentService.getComments(this.incident.id)
            .subscribe(function (data) {
            _this.comments = data;
            _this.ngbModalService.open(_this.modal).result.then(function (result) {
            }, function (reason) {
                console.log(reason);
            });
        });
    };
    IncidentCommentsListModalComponent.prototype.load_comments = function () {
        var _this = this;
        this.incidentService.getComments(this.incident.id)
            .subscribe(function (data) { return _this.comments = data; });
    };
    IncidentCommentsListModalComponent.prototype.add_comment = function () {
        this.modalService.open(modal_service_1.ModalType.AddIncidentComment, this.incident);
    };
    IncidentCommentsListModalComponent.prototype.archive_comment = function (comment) {
        this.incidentService.archiveComment(comment, this.incident).subscribe();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], IncidentCommentsListModalComponent.prototype, "incident", void 0);
    __decorate([
        core_1.ViewChild('content'),
        __metadata("design:type", core_1.ElementRef)
    ], IncidentCommentsListModalComponent.prototype, "modal", void 0);
    IncidentCommentsListModalComponent = __decorate([
        core_1.Component({
            selector: 'incident-comments-list-modal',
            templateUrl: './incident-comments-list-modal.component.html',
            styleUrls: ['./incident-comments-list-modal.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof modal_service_1.ModalService !== "undefined" && modal_service_1.ModalService) === "function" && _a || Object, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object, typeof (_c = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _c || Object, ngx_markdown_1.MarkdownService,
            ng_bootstrap_1.NgbModal])
    ], IncidentCommentsListModalComponent);
    return IncidentCommentsListModalComponent;
    var _a, _b, _c;
}());
exports.IncidentCommentsListModalComponent = IncidentCommentsListModalComponent;
//# sourceMappingURL=incident-comments-list-modal.component.js.map