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
let DailyPageComponent = class DailyPageComponent {
    constructor(personService) {
        this.personService = personService;
        this.cols = [
            { prop: 'name', width: 250, canAutoResize: true, frozenLeft: true, name: '' },
        ];
    }
    ngOnInit() {
        this.getMonitorData();
    }
    getMonitorData() {
        this.personService.getDailyMonitor().subscribe(data => {
            const result = data.json();
            let daily = [];
            for (var i = 0; i < result.columns.length; i++) {
                let c = result.columns[i];
                this.cols[this.cols.length] = {
                    prop: 'incidents' + c.date,
                    name: c.name
                };
                for (var z = 0; z < result.people.length; z++) {
                    let current_people_date = result.people[z];
                    let incidents = result.incidents.filter((i) => {
                        return i.date == c.date && i.person_id == result.people[z].person_id;
                    });
                    if (incidents.length > 0) {
                        current_people_date["incidents" + c.date] = incidents.map(i => {
                            return `<b>${i.start_hour}</b> - ${i.abrev}`;
                        }).join("<br />");
                    }
                    daily[z] = current_people_date;
                }
            }
            this.daily = daily;
            console.log(daily);
            console.log(this.cols);
        }, err => console.error(err), () => console.log('done loading monitor'));
    }
};
__decorate([
    core_1.ViewChild('hdrTpl')
], DailyPageComponent.prototype, "hdrTpl", void 0);
DailyPageComponent = __decorate([
    core_1.Component({
        selector: 'app-full-layout-page',
        templateUrl: './daily-page.component.html',
        styleUrls: ['./daily-page.component.scss'],
        providers: [person_service_1.PersonService]
    })
], DailyPageComponent);
exports.DailyPageComponent = DailyPageComponent;
//# sourceMappingURL=daily-page.component.js.map