import { Injectable } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Result } from "../shared/models/result";

export const APPLICATION_EVENT_CLEANUP = "APPLICATION_EVENT_CLEANUP";

@Injectable()
export class ApplicationEventService {
    private events = new Array<Result>(); 
    private cleanup_interval = 5 * 60 * 1000; //5 minutes
    public event_subject = new Subject<Result>()
    public event$ = this.event_subject.asObservable();

    constructor() {
        setTimeout(this.start_clean_up(), this.cleanup_interval);
    }

    check_event_emitted(event: { id: string } ) {
        return this.events.findIndex(e => e.id == event.id) >= 0;
    }

    emit<T>(event: Result<T>) {
        console.log(event);
        if(this.check_event_emitted(event)) {
            console.log('event supressed!');
            return;
        }

        this.events.push(event);
        this.event_subject.next(event);
    }

    start_clean_up() {
        this.clean_up();
    }

    get_event_count() {
        return this.events.length;
    }

    private clean_up() {        
        console.log('cleanning!');

        const expiration_time = new Date().getTime() - this.cleanup_interval; 
        
        this.events = this.events.filter(e => e.time >= expiration_time);

        this.event_subject.next(Result.Ok(null, APPLICATION_EVENT_CLEANUP));

        setTimeout(() => { 
            this.clean_up() 
        }, this.cleanup_interval);
    }
}