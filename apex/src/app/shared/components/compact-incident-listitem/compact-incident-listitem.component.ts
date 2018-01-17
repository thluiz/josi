import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'compact-incident-listitem',
  templateUrl: './compact-incident-listitem.component.html',
  styleUrls: ['./compact-incident-listitem.scss'],
})

export class CompactIncidentListitemComponent {  

    @Output() incident_treatment_action = new EventEmitter<any>();
    @Input() incident: any;

    constructor() {
            
    }  

    begin_incident_treatment(incident) {
      this.incident_treatment_action.next(incident);
    }
}