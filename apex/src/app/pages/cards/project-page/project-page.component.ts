import { DragulaService } from 'ng2-dragula';
import { CARD_ADDED } from './../../../services/card-service';
import { Subscription } from 'rxjs';
import { ModalType } from './../../../services/modal-service';
import { ModalService } from 'app/services/modal-service';
import { Card } from './../../../shared/models/card.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'app/services/card-service';
import { ActivatedRoute, Router } from '@angular/router';

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

  private card_actions : Subscription;

  constructor(private cardService: CardService, 
              private modalService: ModalService,
              private dragulaService: DragulaService,
              private route: ActivatedRoute,
              private router: Router) {      
                
    dragulaService.drop.subscribe((value) => {            
      let destination = value[2].attributes["data-parent"].value as number;
      let target = value[1].attributes["data-id"].value as number;

      if(destination > 0 && target > 0) {
        this.cardService.saveCardStep(target, destination).subscribe((data) => console.log('OK!'));
      }

    });

    dragulaService.setOptions('childrens', {
      removeOnSpill: false
    });
  }  
  
  ngOnInit() {    
    this.childrens = [];
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];      
      
      this.load_project();
    });    

    this.card_actions = this.cardService.commentChanges$
    /*.filter(ca => ca.type == CARD_ADDED && this.project 
        && ((ca.payload.parent && ca.payload.parent.id == this.project.id)
            || (ca.payload.parent_id == this.project.id))) */
    .subscribe((next) => {
      console.log(next);
            
      this.load_project();
    });    
  }

  private load_project() {
    this.cardService.getProject(this.id).subscribe((data: any) => {
      this.project = data;
    });
  }

  add_task() {
    this.modalService.open(ModalType.AddProjectTask, {
      parent: this.project
    });
  }

  add_step() {
    
  }
  
  ngOnDestroy() {
    
  }
}
