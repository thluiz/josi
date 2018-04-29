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
var utils_service_1 = require("./utils-service");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var Rx_1 = require("rxjs/Rx");
var environment_1 = require("../../environments/environment");
var Subject_1 = require("rxjs/Subject");
exports.CARD_ADDED = "CARD_ADDED";
exports.CARD_CHANGED = "CARD_CHANGED";
exports.CARD_COMMENT_ADDED = "CARD_COMMENT_ADDED";
exports.CARD_ARCHIVED = "CARD_ARCHIVED";
exports.CARD_MOVED = "CARD_MOVED";
var CardAddedAction = /** @class */ (function () {
    function CardAddedAction(payload) {
        this.payload = payload;
        this.type = exports.CARD_ADDED;
    }
    return CardAddedAction;
}());
exports.CardAddedAction = CardAddedAction;
var CardChangedAction = /** @class */ (function () {
    function CardChangedAction(payload) {
        this.payload = payload;
        this.type = exports.CARD_CHANGED;
    }
    return CardChangedAction;
}());
exports.CardChangedAction = CardChangedAction;
var CardArchivedAction = /** @class */ (function () {
    function CardArchivedAction(payload) {
        this.payload = payload;
        this.type = exports.CARD_ARCHIVED;
    }
    return CardArchivedAction;
}());
exports.CardArchivedAction = CardArchivedAction;
var CardMovedAction = /** @class */ (function () {
    function CardMovedAction(payload) {
        this.payload = payload;
        this.type = exports.CARD_MOVED;
    }
    return CardMovedAction;
}());
exports.CardMovedAction = CardMovedAction;
var CardCommentAddedAction = /** @class */ (function () {
    function CardCommentAddedAction(payload) {
        this.payload = payload;
        this.type = exports.CARD_COMMENT_ADDED;
    }
    return CardCommentAddedAction;
}());
exports.CardCommentAddedAction = CardCommentAddedAction;
var CardService = /** @class */ (function () {
    function CardService(http, utilsService) {
        this.http = http;
        this.utilsService = utilsService;
        this.dataUrl = environment_1.environment.api_url;
        this.card_changes = new Subject_1.Subject();
        this.cardChanges$ = this.card_changes.asObservable();
        this.operators$ = new Rx_1.ReplaySubject(1);
    }
    CardService.prototype.saveCard = function (card) {
        var _this = this;
        var clone = JSON.parse(JSON.stringify(card));
        clone.parent.childrens = null;
        clone.parent.steps = null;
        clone.parent.steps_description = null;
        return this.http.post(this.dataUrl + "/cards", { card: clone })
            .do(function (data) { return _this.card_changes.next(new CardAddedAction(data[0])); });
    };
    CardService.prototype.updateCard = function (card) {
        var _this = this;
        return this.http.post(this.dataUrl + "/cards", { card: card })
            .do(function (data) { return _this.card_changes.next(new CardChangedAction(data[0])); });
    };
    CardService.prototype.archiveCard = function (card) {
        var _this = this;
        return this.http.post(this.dataUrl + "/archive_card", { card: card })
            .do(function (data) { return _this.card_changes.next(new CardArchivedAction(data)); });
    };
    CardService.prototype.saveCardStep = function (card_id, step_id) {
        var _this = this;
        return this.http.post(this.dataUrl + "/cards/steps", { card_id: card_id, step_id: step_id })
            .do(function (data) { return _this.card_changes.next(new CardChangedAction(data)); });
    };
    CardService.prototype.getCardData = function (id) {
        return this.http.get(this.dataUrl + ("/cards/" + id));
    };
    CardService.prototype.getOrganizations = function (include_childrens) {
        if (include_childrens === void 0) { include_childrens = false; }
        return this.http.get(this.dataUrl + ("/organizations/0/" + (include_childrens ? 1 : 0)));
    };
    CardService.prototype.getOrganization = function (id, include_childrens) {
        if (include_childrens === void 0) { include_childrens = false; }
        return this.http.get(this.dataUrl + ("/organizations/" + id + "/" + (include_childrens ? 1 : 0)));
    };
    CardService.prototype.getFlatOrganizationsData = function () {
        return this.http.get(this.dataUrl + "/organizations/flat");
    };
    CardService.prototype.getProject = function (id) {
        return this.http.get(this.dataUrl + ("/projects/" + id)).map(function (project) {
            if (!project.childrens || project.childrens.length < 0) {
                project.childrens = [];
            }
            project.steps = project.steps_description.map(function (step_description) {
                var step = {
                    id: step_description.id,
                    name: step_description.name,
                    childrens: [],
                    order: step_description.order
                };
                step.childrens = project.childrens.filter(function (ch) { return ch.current_step_id == step.id; });
                return step;
            });
            project.childrens = project.childrens.filter(function (ch) { return !ch.current_step_id; });
            return project;
        });
    };
    CardService.prototype.getOperators = function (forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        return this.utilsService.cache_results(this.operators$, "/operators", forceRefresh);
    };
    CardService.prototype.saveOperator = function (card_id, person_id) {
        return this.http.post(this.dataUrl + "/person_cards", { person_card: {
                card_id: card_id,
                person_id: person_id
            } });
    };
    CardService.prototype.moveCard = function (card, parent_id, step_id) {
        var _this = this;
        return this.http.post(this.dataUrl + "/move_card", {
            card_id: card.id, parent_id: parent_id, step_id: step_id
        })
            .do(function (data) {
            var old_parent_id = card.parent_id;
            var result = data[0];
            _this.card_changes.next(new CardMovedAction({ card: result, old_parent_id: old_parent_id, new_parent_id: card.parent_id }));
        });
    };
    CardService.prototype.removeOperator = function (card_id, person_id) {
        return this.http.post(this.dataUrl + "/person_cards/delete", { person_card: {
                card_id: card_id,
                person_id: person_id
            } });
    };
    CardService.prototype.saveOrganizationChart = function (id, chart) {
        var requests = [];
        for (var i = 0; i < chart.length; i++) {
            var current_person = chart[i];
            var person_card = { person_card: {
                    card_id: id,
                    person_id: current_person.person_id,
                    position_id: current_person.position,
                    position_description: current_person.position_description,
                    order: i
                }
            };
            requests[requests.length] = this.http.post(this.dataUrl + "/person_cards/", person_card);
        }
        return Rx_1.Observable.forkJoin(requests);
    };
    CardService.prototype.saveProjectStepOrder = function (child_ordering) {
        var requests = [];
        for (var i = 0; i < child_ordering.length; i++) {
            requests[requests.length] = this.http.post(this.dataUrl + "/cards/steps/card_order", child_ordering[i]);
        }
        return Rx_1.Observable.forkJoin(requests);
    };
    CardService.prototype.saveComment = function (card, comment, commentary_type) {
        var _this = this;
        var clone = JSON.parse(JSON.stringify(card));
        clone.parent.childrens = null;
        clone.parent.steps = null;
        clone.parent.steps_description = null;
        clone.childrens = null;
        clone.steps = null;
        clone.steps_description = null;
        return this.http.post(this.dataUrl + "/cards_comments", { card: clone, comment: comment, commentary_type: commentary_type })
            .do(function (data) { return _this.card_changes.next(new CardCommentAddedAction({ card: card, commentaries: data })); });
    };
    CardService.prototype.getCardCommentaries = function (card) {
        return this.http.get(this.dataUrl + ("/cards_comments/" + card.id));
    };
    CardService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, utils_service_1.UtilsService])
    ], CardService);
    return CardService;
}());
exports.CardService = CardService;
//# sourceMappingURL=card-service.js.map