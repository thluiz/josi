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
var ng2_dragula_1 = require("ng2-dragula");
var modal_service_1 = require("./../../../services/modal-service");
var modal_service_2 = require("app/services/modal-service");
var core_1 = require("@angular/core");
var card_service_1 = require("app/services/card-service");
var router_1 = require("@angular/router");
var PROJECT_BAG_NAME = 'childrens';
var ProjectPageComponent = /** @class */ (function () {
    function ProjectPageComponent(cardService, modalService, dragulaService, route, router) {
        var _this = this;
        this.cardService = cardService;
        this.modalService = modalService;
        this.dragulaService = dragulaService;
        this.route = route;
        this.router = router;
        dragulaService.drop.subscribe(function (value) {
            var destination = value[2].attributes["data-parent"].value;
            var origin = value[3].attributes["data-parent"].value;
            var target = value[1].attributes["data-id"].value;
            if (destination > 0 && target > 0) {
                if (origin != destination) {
                    _this.cardService.saveCardStep(target, destination).subscribe(function (data) { return console.log('OK!'); });
                }
                _this.save_cards_in_step_ordering(value[2]);
            }
            else {
                _this.dragulaService.find(PROJECT_BAG_NAME).drake.cancel(true);
            }
        });
        dragulaService.setOptions(PROJECT_BAG_NAME, {
            removeOnSpill: false,
            moves: function (el, source, handle, sibling) { return !el.classList.contains('ignore-item'); }
        });
    }
    ProjectPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.childrens = [];
        this.sub = this.route.params.subscribe(function (params) {
            _this.id = +params['id'];
            _this.load_project();
        });
        this.card_actions = this.cardService.cardChanges$
            .filter(function (ca) {
            return (ca.type == card_service_1.CARD_ADDED || ca.type == card_service_1.CARD_ARCHIVED || ca.type == card_service_1.CARD_COMMENT_ADDED || ca.type == card_service_1.CARD_MOVED)
                && _this.project
                && ((ca.payload.parent && ca.payload.parent.id == _this.project.id)
                    || (ca.payload.parent_id == _this.project.id))
                || (ca.payload && (_this.project.id == ca.payload.old_parent_id || _this.project.id == ca.payload.new_parent_id))
                || (ca.payload.card && ca.payload.card.id == _this.project.id);
        })
            .subscribe(function (action) {
            if (action.type == card_service_1.CARD_COMMENT_ADDED) {
                _this.commentaries = action.payload.commentaries.sort(function (ca) { return ca.id; });
            }
            else {
                _this.load_project();
            }
        });
    };
    ProjectPageComponent.prototype.load_project = function () {
        var _this = this;
        this.cardService.getProject(this.id).subscribe(function (project) {
            _this.project = project;
            _this.getProjectCommentaries(project);
        });
    };
    ProjectPageComponent.prototype.getProjectCommentaries = function (project) {
        var _this = this;
        this.cardService.getCardCommentaries(project).subscribe(function (commentaries) {
            _this.commentaries = commentaries;
        });
    };
    ProjectPageComponent.prototype.add_task = function () {
        this.modalService.open(modal_service_1.ModalType.AddProjectTask, {
            parent: this.project
        });
    };
    ProjectPageComponent.prototype.add_subproject = function () {
        this.modalService.open(modal_service_1.ModalType.AddProject, {
            parent: this.project
        });
    };
    ProjectPageComponent.prototype.add_comment = function () {
        this.modalService.open(modal_service_1.ModalType.AddCardComment, this.project);
    };
    ProjectPageComponent.prototype.add_step = function () {
    };
    ProjectPageComponent.prototype.ngOnDestroy = function () {
        if (this.dragulaService.find(PROJECT_BAG_NAME) !== undefined) {
            this.dragulaService.destroy('childrens');
        }
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    ProjectPageComponent.prototype.save_cards_in_step_ordering = function (destination) {
        var ordering = [];
        for (var i = 0; i < destination.children.length; i++) {
            var data_id = destination.children[i].attributes["data-id"];
            if (!data_id) {
                continue;
            }
            var id = data_id.value;
            ordering[ordering.length] = {
                card_id: id,
                order: i
            };
        }
        this.cardService.saveProjectStepOrder(ordering).subscribe();
    };
    ProjectPageComponent.prototype.open_new_person_modal = function () {
        this.modalService.open(modal_service_1.ModalType.AddPerson, {});
    };
    ProjectPageComponent = __decorate([
        core_1.Component({
            selector: 'app-full-layout-page',
            templateUrl: './project-page.component.html',
            styleUrls: ['../cards-customizations.scss']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof card_service_1.CardService !== "undefined" && card_service_1.CardService) === "function" && _a || Object, typeof (_b = typeof modal_service_2.ModalService !== "undefined" && modal_service_2.ModalService) === "function" && _b || Object, ng2_dragula_1.DragulaService,
            router_1.ActivatedRoute,
            router_1.Router])
    ], ProjectPageComponent);
    return ProjectPageComponent;
    var _a, _b;
}());
exports.ProjectPageComponent = ProjectPageComponent;
//# sourceMappingURL=project-page.component.js.map