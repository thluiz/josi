import { CardCommentary } from 'app/shared/models/card-commentary.model';
import { CardService, CARD_COMMENT_ADDED } from 'app/services/card-service';
import { ModalService, ModalType } from 'app/services/modal-service';
import { Card } from 'app/shared/models/card.model';
import { Location } from 'app/shared/models/location.model';
import { ParameterService } from './../../../services/parameter-service';
import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { PersonService } from 'app/services/person-service';
import { IncidentService } from 'app/services/incident-service';
import { UtilsService } from 'app/services/utils-service';

import { Subscription } from 'rxjs/subscription';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'card-edit-modal',
  templateUrl: './card-edit-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class CardEditModalComponent implements OnInit {  
  card: Card;
  original: Card;
  operators: any[];
  locations: Location[];
  begin_remove = false;
  saving = false;

  @ViewChild('card_edit_modal') card_edit_modal: ElementRef;

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
    
  }  

  ngOnDestroy () {

  }

  open(card: Card) {    
    this.card = card;
    
    if(!card.leaders) {
      card.leaders = [];
    }
    if(this.card.due_date && !this.card.due_date.year) {
      this.card.due_date = this.utilsService.translate_date_to_view(this.card.due_date);
    }

    this.original = JSON.parse(JSON.stringify(this.card));


    Observable.zip(      
      this.parameterService.getActiveBranches(),
      this.cardService.getOperators(),
      this.parameterService.getLocations(),
      (branches, operators: any[], locations: Location[]) => {          
        this.operators = operators;      
        this.locations = locations;

        this.open_modal(this.card_edit_modal, true);

      }).subscribe();              
  }

  entity_compare(p1, p2) {
    return p1 != null && p2 != null && p1.id == p2.id
  }

  private open_modal(content, on_close_action = false) {
    this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }   

  validate_edit_card() {

  }

  cancel(close_action) {
    this.reset_card();

    if(close_action) {
      close_action();
    }
  }

  update_card(close_action) {
    this.saving = true;
    this.cardService.updateCard(this.card).subscribe((data) => {
      if(close_action) {
        this.saving = false;
        close_action();
      }
    });    
  }

  archive_card(close_action) {    
    this.saving = true;
    this.cardService.archiveCard(this.card).subscribe((data) => {      
      if(close_action) {
        this.saving = false;
        close_action();
      }
    });
  }

  private reset_card() {    
    this.card.title = this.original.title;
    this.card.due_date = this.original.due_date;
    this.card.description = this.original.description;
    this.card.leaders = this.original.leaders;    
  }
}