import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

export enum ModalType{
    PersonTreatment,
    IncidentTreatment
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