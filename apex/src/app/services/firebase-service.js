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
const parameter_service_1 = require("app/services/parameter-service");
const incident_service_1 = require("app/services/incident-service");
const core_1 = require("@angular/core");
const firestore_1 = require("angularfire2/firestore");
let FirebaseService = class FirebaseService {
    constructor(afs, incidentService, parameterService) {
        this.afs = afs;
        this.incidentService = incidentService;
        this.parameterService = parameterService;
        this.parameterService.getServerTime()
            .subscribe((server_time) => {
            this.afs
                .collection('incident-events', ref => ref
                .where('time', '>', server_time.milliseconds)
                .orderBy("time", "desc")
                .limit(1)).valueChanges()
                .subscribe((data) => {
                this.incidentService.emit_event(data);
            });
        });
    }
};
FirebaseService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [firestore_1.AngularFirestore, typeof (_a = typeof incident_service_1.IncidentService !== "undefined" && incident_service_1.IncidentService) === "function" && _a || Object, typeof (_b = typeof parameter_service_1.ParameterService !== "undefined" && parameter_service_1.ParameterService) === "function" && _b || Object])
], FirebaseService);
exports.FirebaseService = FirebaseService;
var _a, _b;
//# sourceMappingURL=firebase-service.js.map