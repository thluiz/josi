import { EventGroup } from './../../../shared/models/EventGroup';
import { IncidentService } from 'app/services/incident-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Moment } from 'moment';
import { IntegratedEvent } from 'app/shared/models/IntegratedEvent';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['../calendar-customizations.scss']
})
export class EventsPageComponent implements OnInit, OnDestroy {
  calendarOptions;
  events: IntegratedEvent | EventGroup[] = [{
    id: 1,
    title: "72ª CERIMÔNIA TRADICIONAL DO CLÃ MOY JO LEI OU ",
    description: "63º Ato Cerimonial do Família Moy Jo Lei Ou",
    start_date: "2018-11-01T20:00",
    end_date: "2018-11-01T23:00",
    events: [
      {
        id: 0,
        branch_id: null,
        location_id: 1,
        location_name: "Núcleo Barra da Tijuca, Península/ O2",
        timezone_id: 2,
        gmt: -2,
        title: "63º Ato Cerimonial do Família Moy Jo Lei Ou",
        description: "**  Cerimônia de Admissão na Família-Kung Fu **",
        start_date: "2018-11-01T20:00",
        end_date: "2018-11-01T20:40"
      },
      {
        id: 0,
        branch_id: null,
        location_id: 2,
        location_name: "Restaurante Yuki, Via Parque Shopping",
        timezone_id: 2,
        gmt: -2,
        title: "Jantar de Celebração ao 63º Ato Cerimonial do Família Moy Jo Lei Ou",
        start_date: "2018-11-01T21:00",
        end_date: "2018-11-01T23:00"
      },
    ]
  } as EventGroup];

  constructor(private incidentService: IncidentService) {

  }

  public dragulaOptions: any = {
    removeOnSpill: false
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  loadEvents(start_date : Moment, end_date: Moment, callback) {

  }

  updateEvent(e) {
    console.log(e);
  }

  eventClick(e) {
    console.log(e);
  }

  clickButton(e) {
    console.log(e);
  }
}
