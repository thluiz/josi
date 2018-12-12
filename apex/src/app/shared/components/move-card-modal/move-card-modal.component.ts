import { CardService } from 'app/services/card-service';
import { IncidentService } from 'app/services/incident-service';
import { Observable } from 'rxjs';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Card } from 'app/shared/models/card.model';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'move-card-modal',
  templateUrl: './move-card-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
})
export class MoveCardModalComponent implements OnInit {
  card : Card;
  new_organization: any;
  new_project: any;
  new_sub_project: any;
  new_project_step: any;
  new_subproject_step: any;
  organizations:any;
  errors: string;

  @ViewChild('move_card_modal') move_card_modal: ElementRef;

  constructor(private ngbModalService: NgbModal,
    private cardService : CardService ) {
  }

  ngOnInit() {

  }

  ngOnDestroy () {

  }

  open(parameter : Card) {
    this.card = parameter;
    this.cardService.getFlatOrganizationsData().subscribe((result_data: Result<any[]>) => {
      this.organizations = result_data.data;

      if(this.card.organization_id > 0) {
        // card in subproject
        this.new_organization = result_data.data.find(d => d.id == this.card.organization_id);
        this.new_project = this.new_organization.childs.find(c => c.id == this.card.high_level_id);
        this.new_sub_project = this.new_project.subprojects.find(c => c.id == this.card.parent_id);
        this.new_subproject_step = this.new_sub_project.steps.find(s => s.id == this.card.current_step_id);
      } else if (this.card.high_level_id > 0) {
        // card in project
        this.new_organization = result_data.data.find(d => d.id == this.card.high_level_id);
        this.new_project = this.new_organization.childs.find(c => c.id == this.card.parent_id);
        this.new_project_step = this.new_project.steps.find(s => s.id == this.card.current_step_id);
      }

      if(this.new_organization != null && this.new_organization.childs != null && this.new_organization.childs.length > 0) {
        this.new_organization.childs = (this.new_organization.childs as any[]).sort(this.sortByTitle);
      }

      if(this.new_project != null && this.new_project.subprojects != null &&  this.new_project.subprojects.length > 0) {
        this.new_project.subprojects = (this.new_project.subprojects as any[]).sort(this.sortByTitle);
      }

      this.open_modal(this.move_card_modal);
    });
  }

  private sortByTitle(a, b) {
    let firstLetterA = a.title.substring(0, 1);
    let firstLetterB = b.title.substring(0, 1);

    if(a.title > b.title) return 1;
    if(a.title < b.title) return -1;

    return 0;
  }

  private open_modal(content) {
    this.ngbModalService.open(content).result.then((result) => {

    }, (reason) => {
        console.log(reason);
    });
  }

  move_card(close_action) {
    let parent_id = null;
    let step_id = null;
    if(this.new_sub_project) {
      if(!this.new_subproject_step || this.new_subproject_step.id <= 0) {
        this.errors = "Escolha o passo de destino";
        return;
      }

      parent_id = this.new_sub_project.id,
      step_id = this.new_subproject_step.id;

    } else if(this.new_project) {
      if(!this.new_project_step || this.new_project_step.id <= 0) {
        this.errors = "Escolha o passo de destino";
        return;
      }

      parent_id = this.new_project.id,
      step_id = this.new_project_step.id;

    } else {

      parent_id = this.new_organization.id;
      step_id = null;

    }

    this.cardService.moveCard(this.card, parent_id, step_id)
    .subscribe(data => {
      if(close_action) {
        close_action();
      }
    });
  }
}
