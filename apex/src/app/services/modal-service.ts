import { Observable ,  Subject } from 'rxjs';
import { Injectable } from '@angular/core';

export enum ModalType{
    PersonTreatment,
    IncidentTreatment,
    AddPersonComment,
    AddIncidentComment,
    AddIncidentActionComment,
    AddCardComment,
    IncidentCommentList,
    AddPerson,
    AddIncident,
    AddTask,
    AddProject,
    AddProjectTask,
    DetailTask,
    EditCard,
    PersonComunicationTreatment,
    MoveCard,
    PersonFinancialTreatment,
    PersonScheduleTreatment,
    FileUpload,
    PersonOffering,
    IncidentActionTreatment
}

export interface IModalOpening {
    type: ModalType,
    parameters: any
}

@Injectable()
export class ModalService {

    private open_modal = new Subject<IModalOpening>();
    openModal$ = this.open_modal.asObservable();

    open(type: ModalType, parameters) {
        this.open_modal.next({ type, parameters });
    }
}
