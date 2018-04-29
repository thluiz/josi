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
var card_service_1 = require("app/services/card-service");
var incident_service_1 = require("app/services/incident-service");
var core_1 = require("@angular/core");
var person_service_1 = require("app/services/person-service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var CommentType;
(function (CommentType) {
    CommentType[CommentType["Person"] = 0] = "Person";
    CommentType[CommentType["Incident"] = 1] = "Incident";
    CommentType[CommentType["Card"] = 2] = "Card";
})(CommentType = exports.CommentType || (exports.CommentType = {}));
var AddCommentModalComponent = /** @class */ (function () {
    function AddCommentModalComponent(personService, ngbModalService, incidentService, cardService) {
        this.personService = personService;
        this.ngbModalService = ngbModalService;
        this.incidentService = incidentService;
        this.cardService = cardService;
        this.types = CommentType;
        this.commentary_type = 1;
        this.saving = false;
    }
    AddCommentModalComponent.prototype.person_id = function () {
        if (!this.person) {
            console.log("person nd");
            return 0;
        }
        return this.person.id || this.person.person_id;
    };
    AddCommentModalComponent.prototype.ngOnInit = function () {
    };
    AddCommentModalComponent.prototype.ngOnDestroy = function () {
    };
    AddCommentModalComponent.prototype.open = function (parameter, type) {
        switch (type) {
            case CommentType.Person:
                this.person = parameter;
                break;
            case CommentType.Incident:
                this.incident = parameter;
                break;
            case CommentType.Card:
                this.card = parameter;
                break;
        }
        this.type = type;
        this.open_modal(this.add_comment_modal, true);
    };
    AddCommentModalComponent.prototype.open_modal = function (content, on_close_action) {
        if (on_close_action === void 0) { on_close_action = false; }
        this.saving = false;
        this.ngbModalService.open(content).result.then(function (result) {
        }, function (reason) {
            console.log(reason);
        });
    };
    AddCommentModalComponent.prototype.save_person_comment = function (close_action) {
        var _this = this;
        this.saving = true;
        this.personService.saveCommentAboutPerson(this.person, this.comment).subscribe(function (data) {
            _this.comment = "";
            _this.person = null;
            _this.saving = false;
            if (close_action) {
                close_action();
            }
        });
    };
    AddCommentModalComponent.prototype.save_card_comment = function (close_action) {
        var _this = this;
        this.saving = true;
        this.cardService.saveComment(this.card, this.comment, this.commentary_type).subscribe(function (data) {
            _this.comment = "";
            _this.person = null;
            _this.saving = false;
            if (close_action) {
                close_action();
            }
        });
    };
    AddCommentModalComponent.prototype.save_incident_comment = function (close_action) {
        var _this = this;
        this.saving = true;
        this.incidentService.saveComment(this.incident, this.comment).subscribe(function (data) {
            _this.comment = "";
            _this.incident = null;
            _this.saving = false;
            console.log(close_action);
            if (close_action) {
                close_action();
            }
        });
    };
    __decorate([
        core_1.ViewChild('add_comment_modal'),
        __metadata("design:type", core_1.ElementRef)
    ], AddCommentModalComponent.prototype, "add_comment_modal", void 0);
    AddCommentModalComponent = __decorate([
        core_1.Component({
            selector: 'add-comment-modal',
            templateUrl: './add-comment-modal.component.html',
            styleUrls: ['../../../../assets/customizations.scss'],
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof person_service_1.PersonService !== "undefined" && person_service_1.PersonService) === "function" && _a || Object, ng_bootstrap_1.NgbModal, typeof (_b = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _b || Object, typeof (_c = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _c || Object])
    ], AddCommentModalComponent);
    return AddCommentModalComponent;
    var _a, _b, _c;
}());
exports.AddCommentModalComponent = AddCommentModalComponent;
//# sourceMappingURL=add-comment-modal.component.js.map