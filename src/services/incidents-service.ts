import { DatabaseFacility } from './../facilities/database-facility';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';
import { FirebaseService } from './firebase-service';

export const EVENTS_COLLECTION = "incident-events";
export const INCIDENT_ADDED = "INCIDENT_ADDED";
export const INCIDENT_STARTED = "INCIDENT_STARTED";
export const INCIDENT_CHANGED = "INCIDENT_CHANGED";
export const INCIDENT_TREATED = "INCIDENT_TREATED";
export const INCIDENT_ENDED = "INCIDENT_ENDED";
export const INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
export const INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";

export class IncidentsService {
    
    static async start_incident(incident, responsible_id) : Promise<Result> {
        try {
            let execution = await DatabaseFacility.ExecuteJsonStringSP("StartIncident",
                {"incident" : incident.id},
                {"responsible_id": responsible_id }
            );    

            if(!execution.success) {
                return execution;
            }

            FirebaseService.emit_event(EVENTS_COLLECTION, {
                event_type: INCIDENT_STARTED,
                data: execution.data
            });

            return Result.Ok(JSON.parse(execution.data as string));            
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }                        
    }

    static async reopen_incident(incident, responsible_id) {
        try { 
            let execution = await DatabaseFacility.ExecuteJsonStringSP("ReopenIncident",
                {"incident" : incident.id},
                {"responsible_id": responsible_id }
            );    

            if(!execution.success) {
                return execution;
            }

            FirebaseService.emit_event(EVENTS_COLLECTION, {
                event_type: INCIDENT_STARTED,
                data: execution.data
            });

            return Result.Ok(JSON.parse(execution.data as string));            
            
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }                    
    }

    static async cancel_start_incident(incident, responsible_id) {
        try { 
            let execution = await DatabaseFacility.ExecuteJsonStringSP("CancelIncidentStart",
                {"incident" : incident.id},
                {"responsible_id": responsible_id }
            );    

            if(!execution.success) {
                return execution;
            }

            FirebaseService.emit_event(EVENTS_COLLECTION, {
                event_type: INCIDENT_CHANGED,
                data: execution.data
            });            
            
            return Result.Ok(JSON.parse(execution.data as string));            
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }
    }
    
    static async close_incident(incident, responsible_id) {
        try { 
            let execution = await DatabaseFacility.ExecuteJsonStringSP("CloseIncident",
                {"incident" : incident.id},
                {"close_description" :  incident.closing_contact_text || ""},
                {"responsible_id": responsible_id }
            );    

            if(!execution.success) {
                return execution;
            }

            FirebaseService.emit_event(EVENTS_COLLECTION, {
                event_type: INCIDENT_ENDED,
                data: execution.data
            });            

            return Result.Ok(JSON.parse(execution.data as string));            
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }
    }

    static async remove_incident(incident, responsible_id) {                
        try { 
            let execution = await DatabaseFacility.ExecuteJsonStringSP("RemoveIncident",
                {"incident" : incident.id},
                {"responsible_id": responsible_id }
            );    

            console.log(execution);

            if(!execution.success) {
                return execution;
            }

            FirebaseService.emit_event(EVENTS_COLLECTION, {
                event_type: INCIDENT_CANCELLED,
                data: execution.data
            });            

            return Result.Ok(JSON.parse(execution.data as string));            
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }        
    }
        
    static async register_incident(incident, responsible_id) {
        let date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
        if(incident.time) {
            date += ` ${incident.time.hour}:${incident.time.minute}`;
        }        

        try {            

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

            if(!execution.success) {
                return execution;
            }

            (execution.data as any[]).forEach(element => {
                FirebaseService.emit_event(EVENTS_COLLECTION, {
                    event_type: INCIDENT_ADDED,
                    data: JSON.stringify(execution.data)
                });                
            });
            

            return Result.Ok(execution.data);            
        } catch(error) {            
            return Result.Fail(ErrorCode.GenericError, error);   
        }
    }

    static async reschedule_incident(incident, new_incident, contact, responsible_id) {
        try { 
            let execution = await DatabaseFacility.ExecuteJsonStringSP("RescheduleIncident",
                {"incident" : incident.id},
                {"contact" :  contact},
                {"new_date" : new_incident.date + ' ' + new_incident.start_hour },
                {"responsible_id": responsible_id }
            );    

            if(!execution.success) {
                return execution;
            }

            FirebaseService.emit_event(EVENTS_COLLECTION, {
                event_type: INCIDENT_RESCHEDULED,
                data: execution.data
            });            

            return Result.Ok(JSON.parse(execution.data as string));            
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }
    }
    
    static async register_contact_for_incident(incident, contact, responsible_id) {
        try { 
            let execution = await DatabaseFacility.ExecuteJsonStringSP("RegisterContactForIncident",
                {"incident" : incident.id},
                {"contact" :  contact},                
                {"responsible_id": responsible_id }
            );    

            if(!execution.success) {
                return execution;
            }

            FirebaseService.emit_event(EVENTS_COLLECTION, {
                event_type: INCIDENT_TREATED,
                data: execution.data
            });            

            return Result.Ok(JSON.parse(execution.data as string));            
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }
    }
}