
import {zip as observableZip,  Observable } from 'rxjs';

import {filter} from 'rxjs/operators';
import { CardCommentary } from 'app/shared/models/card-commentary.model';
import { CardService, CARD_COMMENT_ADDED } from 'app/services/card-service';
import { ModalService, ModalType } from 'app/services/modal-service';
import { Card } from 'app/shared/models/card.model';
import { ParameterService } from './../../../services/parameter-service';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { PersonService } from 'app/services/person-service';
import { IncidentService } from 'app/services/incident-service';
import { UtilsService } from 'app/services/utils-service';

import { Subscription } from 'rxjs/subscription';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'card-detail-modal',
  templateUrl: './card-detail-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class CardDetailModalComponent implements OnInit {  
  card: Card;
  commentaries: CardCommentary[];
  begin_remove = false;
  saving = false;

  @ViewChild('card_detail_modal') card_detail_modal: ElementRef;

  private card_actions : Subscription;


  constructor(private personService: PersonService, 
    private parameterService: ParameterService,
    private utilsService: UtilsService,    
    private modalService: ModalService,
    private cardService: CardService,
    private ngbModalService: NgbModal,    
    private datePickerConfig: NgbDatepickerConfig) {
   
      datePickerConfig.firstDayOfWeek = 7
  }
  

  ngOnInit() {  
    this.reset_form();
    
    this.card_actions = this.cardService.cardChanges$.pipe(    
    filter((ca: any) => ca.type == CARD_COMMENT_ADDED && this.card && ca.payload.card.id == this.card.id))
    .subscribe((action) => {
      if(!this.card)
        return; 
      
      this.commentaries = action.payload.commentaries.sort(cm => cm.id);
    });    
  }  

  ngOnDestroy () {
    this.card_actions.unsubscribe();
  }

  show_comments() {

  }

  add_comment() {
    this.modalService.open(ModalType.AddCardComment, this.card);
  }

  archive_card(close_action) { 
    this.saving = true;   
    this.cardService.archiveCard(this.card).subscribe((data) => {      
      if(close_action) {
        close_action();
        this.saving = false;
      }
    });
  }

  edit_card() {
    this.modalService.open(ModalType.EditCard, this.card);
  }

  open(card) {    
    this.card = card;
    this.reset_form();

    if(!this.card.locations) {
      this.card.locations = [];
    }
    
    observableZip(      
      this.parameterService.getActiveBranches(),
      this.cardService.getCardCommentaries(this.card),
      (branches, commentaries: CardCommentary[]) => {                

        this.commentaries = commentaries;

        this.open_modal(this.card_detail_modal, true);

      }).subscribe();              
  }

  private reset_form() {
    this.begin_remove = false;
    this.saving = false;
  }

  private open_modal(content, on_close_action = false) {
    this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }   
}