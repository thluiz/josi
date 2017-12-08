"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const person_service_1 = require("app/services/person-service");
const incident_service_1 = require("app/services/incident-service");
let DailyPageComponent = class DailyPageComponent {
    constructor(personService, incidentService, modalService) {
        this.personService = personService;
        this.incidentService = incidentService;
        this.modalService = modalService;
        this.current_week_day = (new Date).getDay() - 1;
    }
    ngOnInit() {
        this.getMonitorData();
        this.alive = true;
    }
    ngOnDestroy() {
        this.alive = false;
        console.log('destroy timer!');
    }
    branchSelected(e) {
        console.log(e);
    }
    begin_treat_incident(incident) {
        incident.in_treatment = true;
    }
    begin_reschedule_incident(incident) {
        incident.reschedule = true;
        const date = incident.date.split("-");
        incident.new_date = { "year": parseInt(date[0], 10), "month": parseInt(date[1], 10), "day": parseInt(date[2], 10) };
        console.log(incident.new_date);
        const hour = incident.start_hour.split(":");
        incident.new_time = { "hour": parseInt(hour[0]), "minute": parseInt(hour[1]) };
    }
    begin_register_contact(incident) {
        incident.recontact = true;
    }
    reset_treat_incident(incident) {
        incident.recontact = false;
        incident.reschedule = false;
        incident.in_treatment = false;
    }
    close_incident(incident) {
        incident.closed = true;
        this.incidentService.close_incident(incident)
            .toPromise().then((response) => {
            this.getMonitorData(this.current_branch);
        }).catch((reason) => {
            console.log(reason);
        });
    }
    reschedule_incident(incident) {
        incident.treated = true;
        let new_incident = {
            "small_date": incident.new_date.day + "/" + incident.new_date.month,
            "date": incident.new_date.year + "-" + incident.new_date.month + "-" + incident.new_date.day,
            "start_hour": incident.new_time.hour + ":" + incident.new_time.minute,
            "closed": false,
            "abrev": incident.abrev,
            "person_id": incident.person_id,
            "type": incident.type,
            "value": incident.value,
            "id": 0,
            "short_description": incident.short_description,
            "long_description": incident.long_description
        };
        this.incidentService.reschedule_incident(incident, new_incident)
            .toPromise().then((response) => {
            this.getMonitorData(this.current_branch);
        }).catch((reason) => {
            console.log(reason);
        });
    }
    register_contact_for_incident(incident) {
        this.incidentService.register_contact_for_incident(incident, {
            text: incident.contact_text
        })
            .toPromise().then((response) => {
            this.getMonitorData(this.current_branch);
        }).catch((reason) => {
            console.log(reason);
        });
    }
    open(content, incident) {
        this.current_incident = incident;
        this.modalService.open(content).result.then((result) => {
            this.current_incident = null;
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            console.log(reason);
        });
    }
    getMonitorData(current_branche) {
        this.personService.getDailyMonitor().subscribe(data => {
            const result = data.json();
            this.branches = result.branches;
            this.domains = result.domains;
            this.domains.daily = [];
            this.cols = [
                { width: 160 }, { width: 30 }, { width: 30 }
            ];
            for (var i = 0; i < result.columns.length; i++) {
                let c = result.columns[i];
                this.cols[this.cols.length] = {
                    prop: 'incidents' + c.date,
                    name: c.name,
                    current: c.current,
                    width: 150
                };
            }
            for (var w = 0; w < result.domains.length; w++) {
                let domain = result.domains[w];
                this.domains[w].daily = [];
                let people = result.people.filter(p => p.domain_id == domain.id);
                this.domains[w].number_of_members = people.length;
                for (var i = 0; i < result.columns.length; i++) {
                    let c = result.columns[i];
                    for (var z = 0; z < people.length; z++) {
                        let person_incidents = people[z];
                        if (!person_incidents.dates) {
                            person_incidents.dates = [];
                        }
                        person_incidents.dates[i] = person_incidents.dates[i] || [];
                        let incidents = result.incidents.filter((i) => {
                            return i.date == c.date && i.person_id == people[z].person_id;
                        });
                        if (incidents.length > 0) {
                            person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);
                        }
                        this.domains[w].daily[z] = person_incidents;
                    }
                }
            }
            this.current_branch = current_branche;
            if (!this.current_branch) {
                this.current_branch = this.branches[0];
            }
        }, err => console.error(err));
        var d = new Date();
        var hours = d.getHours();
        const update_interval = hours > 22 || hours < 6 ? 600000 : 30000;
        setTimeout(() => this.getMonitorData(current_branche), update_interval);
    }
};
DailyPageComponent = __decorate([
    core_1.Component({
        selector: 'app-full-layout-page',
        templateUrl: './daily-page.component.html',
        styleUrls: ['./daily-page.component.scss'],
        providers: [person_service_1.PersonService, incident_service_1.IncidentService]
    })
], DailyPageComponent);
exports.DailyPageComponent = DailyPageComponent;
//# sourceMappingURL=daily-page.component.js.map