import { CardCommentary } from 'app/shared/models/card-commentary.model';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ModalType } from './../../../services/modal-service';
import { ModalService } from 'app/services/modal-service';
import { Card } from './../../../shared/models/card.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService, CARD_CHANGED, CARD_ADDED, CARD_ARCHIVED, CARD_COMMENT_ADDED } from 'app/services/card-service';
import { ActivatedRoute, Router } from '@angular/router';

const PROJECT_BAG_NAME = 'childrens';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['../cards-customizations.scss']  
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  
  private id;
  private sub;
  project : Card;
  childrens: any;  
  commentaries: CardCommentary[];

  private card_actions : Subscription;

  constructor(private cardService: CardService, 
              private modalService: ModalService,
              private dragulaService: DragulaService,
              private route: ActivatedRoute,
              private router: Router) {      
                
    dragulaService.drop.subscribe((value) => {            
      let destination = value[2].attributes["data-parent"].value as number;
      let origin = value[3].attributes["data-parent"].value as number;
      let target = value[1].attributes["data-id"].value as number;

      if(destination > 0 && target > 0) {
        if(origin != destination) {
          this.cardService.saveCardStep(target, destination).subscribe((data) => console.log('OK!'));
        }
        this.save_cards_in_step_ordering(value[2])
      } else {
        this.dragulaService.find(PROJECT_BAG_NAME).drake.cancel(true);
      }       
    });

    dragulaService.setOptions(PROJECT_BAG_NAME, {
      removeOnSpill: false,
      moves: (el, source, handle, sibling) => !el.classList.contains('ignore-item')
    });
  }  

  ngOnInit() {    
    this.childrens = [];
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];      
      
      this.load_project();
    });    

    this.card_actions = this.cardService.cardChanges$
    .filter((ca: any) => 
        (ca.type == CARD_ADDED || ca.type == CARD_ARCHIVED || ca.type == CARD_COMMENT_ADDED) 
        && this.project 
        && ((ca.payload.parent && ca.payload.parent.id == this.project.id)
            || (ca.payload.parent_id == this.project.id))
            || (ca.payload.card && ca.payload.card.id == this.project.id))
    .subscribe((action) => {         
      if(action.type == CARD_COMMENT_ADDED) {
        this.commentaries = action.payload.commentaries.sort(ca => ca.id);
      } else {
        this.load_project();
      }
    });    
  }

  private load_project() {
    this.cardService.getProject(this.id).subscribe((project: any) => {
      this.project = project;
      this.getProjectCommentaries(project); 
    });    
  }

  private getProjectCommentaries(project: any) {
    this.cardService.getCardCommentaries(project).subscribe((commentaries: CardCommentary[]) => {
      this.commentaries = commentaries;
    });
  }

  add_task() {
    this.modalService.open(ModalType.AddProjectTask, {
      parent: this.project
    });
  }

  add_subproject() {
    this.modalService.open(ModalType.AddProject, {
      parent: this.project
    });
  }

  add_comment() {
    this.modalService.open(ModalType.AddCardComment, this.project);
  }

  add_step() {
    
  }
  
  ngOnDestroy() {    
    if (this.dragulaService.find(PROJECT_BAG_NAME) !== undefined) { 
      this.dragulaService.destroy('childrens'); 
    } 
  }

    
  save_cards_in_step_ordering(destination): any {
    let ordering : {card_id:number, order: number}[] = [];
      
    for(let i = 0; i < destination.children.length; i++) {
      let data_id = destination.children[i].attributes["data-id"];

      if(!data_id) {
        continue;
      }

      let id = data_id.value as number;
      ordering[ordering.length] = {
        card_id: id,
        order: i
      }
    }            
      
    this.cardService.saveProjectStepOrder(ordering).subscribe();
  }
}
