
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalService, ModalType } from 'app/services/modal-service';
import { PersonDataTreatmentModalComponent } from 'app/shared/components/person-data-treatment-modal/person-data-treatment-modal.component';
import { IncidentTreatmentModalComponent } from 'app/shared/components/incident-treatment-modal/incident-treatment-modal.component';
import { AddCommentModalComponent, CommentType } from 'app/shared/components/add-comment-modal/add-comment-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    private modal_subscriber: Subscription;

    @ViewChild(PersonDataTreatmentModalComponent) personDataTreatmentModal : PersonDataTreatmentModalComponent;
    @ViewChild(IncidentTreatmentModalComponent) incidentTreatmentModal : IncidentTreatmentModalComponent;
    @ViewChild(AddCommentModalComponent) addCommentModal : AddCommentModalComponent;

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
                }
            });
    }
    
    ngOnDestroy() {
        this.modal_subscriber.unsubscribe();    
    }
}