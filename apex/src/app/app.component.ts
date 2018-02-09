import { NewPersonModalComponent } from './shared/components/new-person-modal/new-person-modal.component';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalService, ModalType } from 'app/services/modal-service';
import { PersonDataTreatmentModalComponent } from 'app/shared/components/person-data-treatment-modal/person-data-treatment-modal.component';
import { IncidentTreatmentModalComponent } from 'app/shared/components/incident-treatment-modal/incident-treatment-modal.component';
import { AddCommentModalComponent, CommentType } from 'app/shared/components/add-comment-modal/add-comment-modal.component';
import { IncidentCommentsListModalComponent } from 'app/shared/components/incident-comments-list-modal/incident-comments-list-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['../assets/customizations.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    private modal_subscriber: Subscription;

    @ViewChild(PersonDataTreatmentModalComponent) personDataTreatmentModal : PersonDataTreatmentModalComponent;
    @ViewChild(IncidentTreatmentModalComponent) incidentTreatmentModal : IncidentTreatmentModalComponent;
    @ViewChild(AddCommentModalComponent) addCommentModal : AddCommentModalComponent;
    @ViewChild(IncidentCommentsListModalComponent) incidentCommentsList : IncidentCommentsListModalComponent;
    @ViewChild(NewPersonModalComponent) newPersonModal : NewPersonModalComponent;

    constructor(private modalService: ModalService) {

    }

    ngAfterViewInit() {
    
    }

    ngOnInit() {    
        this.modal_subscriber = this.modalService.openModal$
            .subscribe((data) => {
                switch(data.type) {
                    case ModalType.PersonTreatment:                        
                        this.personDataTreatmentModal.open(data.parameters);
                        break;
                    case ModalType.IncidentTreatment:
                        this.incidentTreatmentModal.open(data.parameters);
                        break;
                    case ModalType.AddPersonComment:
                        this.addCommentModal.open(data.parameters, CommentType.Person);
                        break;
                    case ModalType.AddIncidentComment:
                        this.addCommentModal.open(data.parameters, CommentType.Incident);
                        break;
                    case ModalType.IncidentCommentList:
                        this.incidentCommentsList.open(data.parameters);
                        break;  
                    case ModalType.AddPerson:
                        this.newPersonModal.open();
                }
            });
    }
    
    ngOnDestroy() {
        this.modal_subscriber.unsubscribe();    
    }
}