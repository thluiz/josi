import { Subscription } from 'rxjs/subscription'; 
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CardService, CARD_CHANGED, CARD_COMMENT_ADDED } from 'app/services/card-service';
import { ParameterService } from 'app/services/parameter-service';
import { ModalService, ModalType } from 'app/services/modal-service';

import { Card } from 'app/shared/models/card.model';

@Component({
  selector: 'compact-card',
  templateUrl: './compact-card.component.html',
  styleUrls: ['./compact-card.scss']
})
export class CompactCardComponent implements OnInit, OnDestroy {  

  @Input() card : Card;  
  
  private card_actions : Subscription;
  
  constructor(private parameterService: ParameterService,
              private cardService: CardService,
              private modalService: ModalService) {
      
  }  

  ngOnInit() {        
    this.card_actions = this.cardService.cardChanges$      
    .subscribe((action : any) => {
      if(action.type == CARD_COMMENT_ADDED && action.payload.card.id == this.card.id) {      
        this.card = action.payload.card;
        this.card.comment_count = action.payload.commentaries.length;
      }

      if(action.type == CARD_CHANGED && action.payload.id == this.card.id) {
        this.card = action.payload;
      }
    });
  }

  ngOnDestroy() {
    if(this.card_actions) {
      this.card_actions.unsubscribe();
    }
  }

  open_detail_modal() {        
    this.modalService.open(ModalType.DetailTask, this.card);
  }

  edit_card() {
    this.modalService.open(ModalType.EditCard, this.card);
  }

  updateOrganization() {    
  }

  add_task(organization) {        
  }

  add_project(organization) {
    
  }
}