import { DatabaseFacility } from './../facilities/database-facility';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';
import { FirebaseService } from './firebase-service';
import { LoggerService, ErrorOrigins } from './logger-service';
import { trylog } from '../decorators/trylog-decorator';
import { firebaseEmitter, firebaseMultipleEmitter } from '../decorators/firebase-emitter-decorator';

export const EVENTS_COLLECTION = "incident-events";
export const INCIDENT_ADDED = "INCIDENT_ADDED";
export const INCIDENT_STARTED = "INCIDENT_STARTED";
export const INCIDENT_CHANGED = "INCIDENT_CHANGED";
export const INCIDENT_TREATED = "INCIDENT_TREATED";
export const INCIDENT_ENDED = "INCIDENT_ENDED";
export const INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
export const INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";

export class IncidentsService {
    
    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_STARTED)
    static async start_incident(incident, responsible_id) : Promise<Result> {        
        let execution = await DatabaseFacility.ExecuteJsonSP("StartIncident",
            {"incident" : incident.id},
            {"responsible_id": responsible_id }
        );    

        return execution; 
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_STARTED)
    static async reopen_incident(incident, responsible_id) : Promise<Result> {        
        let execution = await DatabaseFacility.ExecuteJsonSP("ReopenIncident",
            {"incident" : incident.id},
            {"responsible_id": responsible_id }
        );    

        return execution;                        
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_CHANGED)
    static async cancel_start_incident(incident, responsible_id) : Promise<Result> {        
        let execution = await DatabaseFacility.ExecuteJsonSP("CancelIncidentStart",
            {"incident" : incident.id},
            {"responsible_id": responsible_id }
        );    

        return execution;                    
    }
    
    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_ENDED)
    static async close_incident(incident, responsible_id) : Promise<Result> {        
        let execution = await DatabaseFacility.ExecuteJsonSP("CloseIncident",
            {"incident" : incident.id},
            {"close_description" :  incident.closing_text || ""},
            {"responsible_id": responsible_id }
        );    

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_CANCELLED)
    static async remove_incident(incident, responsible_id) : Promise<Result> {                        
        let execution = await DatabaseFacility.ExecuteJsonSP("RemoveIncident",
            {"incident" : incident.id},
            {"responsible_id": responsible_id }
        );    

        return execution;                          
    }

    @trylog() 
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_ADDED)   
    static async register_incident(incident, responsible_id) : Promise<Result> {
        let date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
        if(incident.time) {
            date += ` ${incident.time.hour}:${incident.time.minute}`;
        }        

        let execution = await DatabaseFacility.ExecuteJsonSP<any[]>(
            "RegisterNewIncident",
            {"description" : incident.description},
            {"responsible_id": responsible_id },
            {"people": incident.people.filter(f => f.person_id > 0).map(p => p.person_id).join(",")},
            {"date":  date},
            {"type": incident.type.id},
            {"branch": incident.branch_id},
            {"value": incident.value},
            {"start_activity": incident.start_activity ? 1 : 0},
            {"register_closed" : incident.close_activity == 1 ? 1 : 0},
            {"register_treated" : incident.close_activity == 2 ? 1 : 0},
            {"new_people" : incident.people.filter(f => f.person_id == 0).map(p => p.name.trim()).join(",") },
        );                                                                                        

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_RESCHEDULED)
    static async reschedule_incident(incident, new_incident, contact, responsible_id) : Promise<Result> {        
        let execution = await DatabaseFacility.ExecuteJsonSP("RescheduleIncident",
            {"incident" : incident.id},
            {"contact" :  contact},
            {"new_date" : new_incident.date + ' ' + new_incident.start_hour },
            {"responsible_id": responsible_id }
        );    

        return execution;
    }
    
    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION, INCIDENT_TREATED)
    static async register_contact_for_incident(incident, contact, responsible_id) : Promise<Result> {        
        let execution = await DatabaseFacility.ExecuteJsonSP("RegisterContactForIncident",
            {"incident" : incident.id},
            {"contact" :  contact},                
            {"responsible_id": responsible_id }
        );    

        return execution;                    
    }
}