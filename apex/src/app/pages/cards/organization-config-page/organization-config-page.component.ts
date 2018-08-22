import { Subscription } from 'rxjs';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'app/services/card-service';
import { ActivatedRoute, Router } from '@angular/router';
import { DragulaService, DragulaModule } from 'ng2-dragula';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './organization-config-page.component.html',
  styleUrls: ['../cards-customizations.scss']
})
export class OrganizationConfigPageComponent implements OnInit, OnDestroy {

  private id;
  private sub : Subscription;
  organization;
  card_positions;
  saving_chart = false;
  new_operator_id;
  available_operators = [];
  modalRef : NgbModalRef;

  constructor(private cardService: CardService,
              private parameterService: ParameterService,
              private route: ActivatedRoute,
              private router: Router,
              private dragulaService: DragulaService,
              private ngbModalService: NgbModal) {

  }

  public dragulaOptions: any = {
    removeOnSpill: false
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];

      this.parameterService.getPersonCardPositions().subscribe((result_data : any) => {
        this.card_positions = result_data.data.filter(cp => cp.hierarchical);
      });
    });

    this.load_organization_data();
  }

  ngOnDestroy() {
     if(this.sub) {
       this.sub.unsubscribe();
     }
  }

  load_organization_data() {
    this.cardService.getOrganization(this.id).subscribe((result_data : any) => {
      this.organization = result_data.data[0];
    });
  }

  add_new_operator(content) {
    let current_operators = this.organization.people;

    this.cardService.getOperators().subscribe((data : any) => {
      this.available_operators = data.filter(o => current_operators.find(co => co.person_id == o.id) == null);

      this.modalRef = this.ngbModalService.open(content);

      this.modalRef.result.then(() => {

      }, (reason) => {
          console.log(reason);
      });
    });
  }

  save_new_operator() {
    this.cardService.saveOperator(this.id, this.new_operator_id).subscribe(() => {
      if(this.modalRef) {
        this.modalRef.close();
      }
      this.load_organization_data();
      this.new_operator_id = null;
    });
  }

  save_organization_chart() {
    this.saving_chart = true;
    this.cardService.saveOrganizationChart(this.id, this.organization.people)
    .subscribe(() => {
      this.saving_chart = false;
    });
  }

  remove_person(person_card) {
    this.cardService.removeOperator(this.id, person_card.person_id)
    .subscribe(() => {
      this.load_organization_data();
    });
  }
}
