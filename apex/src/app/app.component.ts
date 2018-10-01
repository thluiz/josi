import { IncidentActionTreatmentModalComponent } from "app/shared/components/incident-action-treatment-modal/incident-action-treatment-modal.component";
import { FirebaseService } from "./services/firebase-service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";

import { ModalService, ModalType } from "app/services/modal-service";
import {
  AddCommentModalComponent,
  CommentType
} from "app/shared/components/add-comment-modal/add-comment-modal.component";
import { CardDetailModalComponent } from "app/shared/components/card-detail-modal/card-detail-modal.component";
import { CardEditModalComponent } from "app/shared/components/card-edit-modal/card-edit-modal.component";
import { FileUploadModalComponent } from "app/shared/components/file-upload-modal/file-upload-modal.component";
import { IncidentCommentsListModalComponent } from "app/shared/components/incident-comments-list-modal/incident-comments-list-modal.component";
import { IncidentTreatmentModalComponent } from "app/shared/components/incident-treatment-modal/incident-treatment-modal.component";
import { MoveCardModalComponent } from "app/shared/components/move-card-modal/move-card-modal.component";
import { PersonComunicationTreatmentModalComponent } from "app/shared/components/person-communication-treatment-modal/person-communication-treatment-modal.component";
import { PersonDataTreatmentModalComponent } from "app/shared/components/person-data-treatment-modal/person-data-treatment-modal.component";
import { NewInicidentModalComponent } from "app/shared/components/new-incident-modal/new-incident-modal.component";
import { NewPersonModalComponent } from "app/shared/components/new-person-modal/new-person-modal.component";
import {
  NewCardModalComponent,
  CardType
} from "app/shared/components/new-card-modal/new-card-modal.component";
import { PersonFinancialTreatmentModalComponent } from "app/shared/components/person-financial-treatment-modal/person-financial-treatment-modal.component";
import { PersonScheduleTreatmentModalComponent } from "app/shared/components/person-schedule-treatment-modal/person-schedule-treatment-modal.component";
import { PersonOfferingModalComponent } from "./shared/components/person-offering-modal/person-offering-modal.component";

import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["../assets/customizations.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  private modal_subscriber: Subscription;

  @ViewChild(PersonDataTreatmentModalComponent)
  personDataTreatmentModal: PersonDataTreatmentModalComponent;

  @ViewChild(IncidentTreatmentModalComponent)
  incidentTreatmentModal: IncidentTreatmentModalComponent;

  @ViewChild(AddCommentModalComponent)
  addCommentModal: AddCommentModalComponent;

  @ViewChild(IncidentCommentsListModalComponent)
  incidentCommentsList: IncidentCommentsListModalComponent;

  @ViewChild(NewPersonModalComponent)
  newPersonModal: NewPersonModalComponent;

  @ViewChild(NewInicidentModalComponent)
  newIncidentModal: NewInicidentModalComponent;

  @ViewChild(NewCardModalComponent)
  newCardModal: NewCardModalComponent;

  @ViewChild(CardDetailModalComponent)
  cardDetailModal: CardDetailModalComponent;

  @ViewChild(CardEditModalComponent)
  cardEditModal: CardEditModalComponent;

  @ViewChild(PersonComunicationTreatmentModalComponent)
  personComunicationTreatmentModal: PersonComunicationTreatmentModalComponent;

  @ViewChild(MoveCardModalComponent)
  moveCardModal: MoveCardModalComponent;

  @ViewChild(PersonFinancialTreatmentModalComponent)
  personFinancialTreatmentModal: PersonFinancialTreatmentModalComponent;

  @ViewChild(PersonScheduleTreatmentModalComponent)
  personScheduleTreatmentModal: PersonScheduleTreatmentModalComponent;

  @ViewChild(FileUploadModalComponent)
  fileUploadModal: FileUploadModalComponent;
  @ViewChild(PersonOfferingModalComponent)
  personOfferingModal: PersonOfferingModalComponent;

  @ViewChild(IncidentActionTreatmentModalComponent)
  incidentActionTreatmentModal: IncidentActionTreatmentModalComponent;

  constructor(
    private modalService: ModalService,
    private firebaseService: FirebaseService
  ) {}

  ngAfterViewInit() {}

  ngOnInit() {
    this.modal_subscriber = this.modalService.openModal$.subscribe(data => {
      switch (data.type) {
        case ModalType.PersonTreatment:
          this.personDataTreatmentModal.open(data.parameters);
          break;
        case ModalType.PersonComunicationTreatment:
          this.personComunicationTreatmentModal.open(data.parameters);
          break;
        case ModalType.IncidentTreatment:
          this.incidentTreatmentModal.open(data.parameters);
          break;
        case ModalType.IncidentActionTreatment:
          this.incidentActionTreatmentModal.open(data.parameters);
          break;
        case ModalType.AddPersonComment:
          this.addCommentModal.open(data.parameters, CommentType.Person);
          break;
        case ModalType.AddIncidentComment:
          this.addCommentModal.open(data.parameters, CommentType.Incident);
          break;
        case ModalType.AddIncidentActionComment:
          this.addCommentModal.open(
            data.parameters,
            CommentType.IncidentAction
          );
          break;
        case ModalType.AddCardComment:
          this.addCommentModal.open(data.parameters, CommentType.Card);
          break;
        case ModalType.IncidentCommentList:
          this.incidentCommentsList.open(data.parameters);
          break;
        case ModalType.AddPerson:
          this.newPersonModal.open(data.parameters);
          break;
        case ModalType.AddIncident:
          this.newIncidentModal.open(data.parameters);
          break;
        case ModalType.AddTask:
          if (!data.parameters) {
            data.parameters = {};
          }
          data.parameters.card_type = CardType.Task;
          this.newCardModal.open(data.parameters);
          break;
        case ModalType.AddProject:
          if (!data.parameters) {
            data.parameters = {};
          }
          data.parameters.card_type = CardType.Project;
          this.newCardModal.open(data.parameters);
          break;
        case ModalType.AddProjectTask:
          if (!data.parameters) {
            data.parameters = {};
          }
          data.parameters.card_type = CardType.ProjectTask;
          this.newCardModal.open(data.parameters);
          break;
        case ModalType.DetailTask:
          this.cardDetailModal.open(data.parameters);
          break;
        case ModalType.EditCard:
          this.cardEditModal.open(data.parameters);
          break;
        case ModalType.MoveCard:
          this.moveCardModal.open(data.parameters);
          break;
        case ModalType.PersonFinancialTreatment:
          this.personFinancialTreatmentModal.open(data.parameters);
          break;
        case ModalType.PersonOffering:
          this.personOfferingModal.open(data.parameters);
          break;
        case ModalType.PersonScheduleTreatment:
          this.personScheduleTreatmentModal.open(data.parameters);
          break;
        case ModalType.FileUpload:
          this.fileUploadModal.open(data.parameters);
      }
    });
  }

  ngOnDestroy() {
    this.modal_subscriber.unsubscribe();
  }
}
