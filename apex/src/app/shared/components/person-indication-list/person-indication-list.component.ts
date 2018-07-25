
import { zip as observableZip, Subscription, Observable } from 'rxjs';

import { filter } from 'rxjs/operators';
import { CardService } from 'app/services/card-service';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { SecurityService } from 'app/services/security-service';
import { ParameterService, Configurations } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalType, ModalService } from 'app/services/modal-service';

@Component({
  selector: 'person-indication-list',
  templateUrl: './person-indication-list.component.html',
  styleUrls: ['../../../../assets/customizations.scss']
})
export class PersonIndicationListComponent implements OnInit, OnDestroy {
  loading = false;
  indications: any[];
  indirect_indications: any[];
  invites: any[];
  current_date : number;

  @Input() d: any;
  @Input() person: any;
  @Input() showHeader = true;
  @Input() navigateToIndication = false;
  @Output() onNavigateToIndication = new EventEmitter<boolean>();

  saving = false;
  needed_direct_indications = 0;
  needed_indirect_indications = 0;
  new_indication = {
    name: "",
    contact_type1: 0,
    contact1: "",
    contact_type2: 0,
    contact2: "",
    contact_type3: 0,
    contact3: "",
    valid: false,
    comment: "",
    person_id: 0,
    branch_id: 0,
    operator_id: 0,
    indication_contact_type: 0,
    occupation: '',
    district: '',
    age: ''
  };

  indication_types = [{ id: 0, description: 'Indicação' }, { id: 1, description: 'Convite' }, { id: 2, description: 'Anônimo' }];

  contact_types: any[];
  branches: any[];
  operators: any[];
  errors: string[] = [];
  current_indication: any;
  new_indication_type: number;
  private last_call: Date;

  private indication_changes_subscriber: Subscription;

  constructor(private ngbModal: NgbModal,
    private modalService: ModalService,
    private parameterService: ParameterService,
    private securityService: SecurityService,
    private cardService: CardService,
    private personService: PersonService) {

  }

  ngOnInit() {

    this.indication_changes_subscriber = this.personService.indicationChanges$.pipe(
      filter((data) => data != null && data.person_id == this.person.id))
      .subscribe((data) => {
        this.load_indications();
      });

    this.load_indications();
  }

  ngOnDestroy() {
    this.indication_changes_subscriber.unsubscribe();
  }

  navigateToPerson(person_id) {
    this.person.id = person_id;
    this.load_indications();
    this.onNavigateToIndication.emit(person_id);
  }

  load_indications() {
    this.current_date = (new Date().getTime())/1000;
    this.loading = true;
    if (this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents())) {
      this.loading = false;
      return;
    }

    this.personService.getPersonIndications(this.person.id)
      .subscribe((data: any[]) => {

        this.parameterService.getConfigurations().subscribe((configs: any[]) => {
          var minimal_direct = configs.find(d => d.id == Configurations.MinimalDirectIndicationsPerActiveMember.toFixed());
          var minimal_indirect = configs.find(d => d.id == Configurations.MinimalIndirectIndicationsPerActiveMember.toFixed());

          if (minimal_direct.value > 0) {
            this.needed_direct_indications = minimal_direct.value - (data.filter(d => d.relationship_type == 10).length);
          }

          if (minimal_indirect.value > 0) {
            this.needed_indirect_indications = minimal_indirect.value
              - (data.filter(d => d.relationship_type == 13).length)
              - (data.filter(d => d.relationship_type == 14).length);
          }
        });

        this.indications = data;
        this.indirect_indications = data.filter(d => d.relationship_type == 13 || d.relationship_type == 14);
        this.invites = data.filter(d => d.relationship_type == 10);
      });

    this.last_call = new Date();
    this.loading = false;
  }

  open_card(card_id) {
    this.cardService.getCardData(card_id).subscribe(card => {
      console.log(card);
      this.modalService.open(ModalType.DetailTask, card[0]);
    });
  }

  openChangeIndicationType(indication, content) {
    this.new_indication_type = -1;
    this.current_indication = indication;
    this.ngbModal.open(content).result.then((result) => {

    }, (reason) => {
      console.log(reason);
    });
  }

  changeIndicationType(close_action) {
    this.saving = true;

    this.personService
      .changeIndicationType(this.current_indication, this.new_indication_type)
      .subscribe((data) => {
        this.saving = false;

        if (close_action) {
          close_action('indication type changed!');
        }
        this.load_indications();
      });
  }

  open(content) {
    this.saving = false;

    this.new_indication = {
      name: "",
      contact_type1: 0,
      contact1: "",
      contact_type2: 0,
      contact2: "",
      contact_type3: 0,
      contact3: "",
      valid: false,
      comment: "",
      person_id: this.person.id,
      branch_id: this.person.branch_id,
      operator_id: 0,
      indication_contact_type: 0,
      occupation: '',
      district: '',
      age: ''
    };

    observableZip(
      this.securityService.getCurrentUserData(),
      this.parameterService.getContactTypes(),
      this.parameterService.getActiveBranches(),
      this.cardService.getOperators(),
      (user, contact_types, branches, operators) => {
        this.new_indication.operator_id = user.person_id;
        this.contact_types = contact_types;
        this.branches = branches;
        this.operators = operators;

        this.ngbModal.open(content).result.then((result) => {

        }, (reason) => {
          console.log(reason);
        });
      }
    ).subscribe();
  }

  save_new_indication(close_action) {
    this.saving = true;

    this.personService.saveIndication(this.new_indication).subscribe((data) => {
      this.saving = false;

      if (close_action) {
        close_action();
      }
    });
  }

  remove_indication(indication) {

  }

  validate_new_indication() {
    this.errors = [];
    if (!this.new_indication) {
      return;
    }

    if (!this.new_indication.name || this.new_indication.name.length < 3) {
      this.errors.push("Informe o nome da pessoa");
    }

    if (this.new_indication.branch_id <= 0) {
      this.errors.push("Informe o núcleo para indicação");
    }

    if (this.new_indication.operator_id <= 0) {
      this.errors.push("Informe o operador responsável para indicação");
    }

    if ((!this.new_indication.contact1 || this.new_indication.contact1.length < 3)
      && (!this.new_indication.contact2 || this.new_indication.contact2.length < 3)
      && (!this.new_indication.contact3 || this.new_indication.contact3.length < 3)) {
      this.errors.push("Informe ao menos o contato principal da pessoa");
    }

    if (this.new_indication.contact1
      && this.new_indication.contact1.length >= 3
      && this.new_indication.contact_type1 <= 0) {
      this.errors.push("Informe o tipo do primeiro contato");
    }

    if (this.new_indication.contact2
      && this.new_indication.contact2.length >= 3
      && this.new_indication.contact_type2 <= 0) {
      this.errors.push("Informe o tipo do segundo contato");
    }

    if (this.new_indication.contact3
      && this.new_indication.contact3.length >= 3
      && this.new_indication.contact_type3 <= 0) {
      this.errors.push("Informe o tipo do terceiro contato");
    }

    this.new_indication.valid = this.errors.length <= 0;
  }
}