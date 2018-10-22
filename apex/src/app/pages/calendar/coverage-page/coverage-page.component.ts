import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './coverage-page.component.html',
  styleUrls: ['../calendar-customizations.scss']
})
export class CoveragePageComponent implements OnInit, OnDestroy {
  calendarOptions;
  events = [];

  constructor() {

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

    this.events.push({
      title: 'Titularidade <br /> <i class="fas fa-bomb"></i> - André - \r\n TESTE \r\n TESTE \r\n TESTE!',
      start: '2018-10-25 18:00',
      end: '2018-10-25 22:00',
      description: "abc teste"
    }, {
      title: 'New event',
      start: '2018-10-22 11:00',
      end: '2018-10-22 15:00',
      description: "abc teste",
      class: "teste-normal",
      style: "background-color: orange"
    }, {
      title: 'New event 2 - <i class="fas fa-taxi"></i>',
      start: '2018-10-22 11:00',
      end: '2018-10-22 15:00',
      description: "abc teste",
      class: "teste-taxi",
      style: "background-color: red; color: white"
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
