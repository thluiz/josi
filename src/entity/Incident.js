"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const PersonIncident_1 = require("./PersonIncident");
const Person_1 = require("./Person");
const typeorm_1 = require("typeorm");
const Branch_1 = require("./Branch");
const Card_1 = require("./Card");
const IncidentType_1 = require("./IncidentType");
let Incident = Incident_1 = class Incident {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Incident.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => IncidentType_1.IncidentType),
    typeorm_1.JoinColumn({ name: "incident_type" }),
    __metadata("design:type", IncidentType_1.IncidentType)
], Incident.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'datetime', default: () => 'getdate()' }),
    __metadata("design:type", Date)
], Incident.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "treated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "closed", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "scheduled", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "closed_on", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "closed_by" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "closed_by", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "responsible_id" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "responsible", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Branch_1.Branch),
    typeorm_1.JoinColumn({ name: "branch_id" }),
    __metadata("design:type", Branch_1.Branch)
], Incident.prototype, "branch", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Incident.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Incident.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Incident.prototype, "close_text", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "fund_value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "comment_count", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "cancelled", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "cancelled_on", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "cancelled_by" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "cancelled_by", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "started_on", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        default: () => "getdate()",
        type: "datetime"
    }),
    __metadata("design:type", Date)
], Incident.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "started_by" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "started_by", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Card_1.Card),
    typeorm_1.JoinColumn({ name: "card_id" }),
    __metadata("design:type", Card_1.Card)
], Incident.prototype, "card_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "person_schedule_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "payment_method_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "contact_method_id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Incident_1),
    typeorm_1.JoinColumn({ name: "ownership_id" }),
    __metadata("design:type", Incident)
], Incident.prototype, "ownership", void 0);
__decorate([
    typeorm_1.OneToMany(type => PersonIncident_1.PersonIncident, person_incident => person_incident.incident, { cascade: true }),
    __metadata("design:type", Array)
], Incident.prototype, "people_incidents", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "define_fund_value", void 0);
Incident = Incident_1 = __decorate([
    typeorm_1.Entity()
], Incident);
exports.Incident = Incident;
var Incident_1;
//# sourceMappingURL=Incident.js.map