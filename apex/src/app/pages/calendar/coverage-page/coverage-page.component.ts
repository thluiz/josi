import { IncidentService } from 'app/services/incident-service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './coverage-page.component.html',
  styleUrls: ['../calendar-customizations.scss']
})
export class CoveragePageComponent implements OnInit, OnDestroy {
  calendarOptions;
  events = [];

  constructor(private incidentService: IncidentService) {

  }

  public dragulaOptions: any = {
    removeOnSpill: false
  }

  ngOnInit() {
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      selectable: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      defaultView: "agendaWeek",
      locale: "pt-br",
      events: this.events,
      eventRender: function(event, element) {
        console.log(event);
        console.log(element);
      }
    };

    this.incidentService.getCalendarData().subscribe((result_data : any) => {
      let data = result_data.data[0];
      let events = [];

      data.ownerships.forEach(ow => {
        let title = ow.person_name;
        let description = "";

        if(ow.people > 0) {
          description += `- ${ow.people} pessoa${ow.people > 1 ? 's' : ''}`;
        }

        if(ow.incidents_count) {
          //let incidents = "<ul>";

          description += ow.incidents_count.map(i => `<br />- ${i.abrev}: ${i.items}`).join(" ");

          //incidents += "</ul>";
          //description += incidents;
        }


        events.push(
          {
            title,
            start: ow.start_date || ow.date,
            end: ow.end_date,
            description
          }
        )
      });

      this.events = events
    });
  }

  ngOnDestroy() {
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
