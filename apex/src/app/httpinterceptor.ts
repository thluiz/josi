import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } 
from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

import { AppInsightsService } from '@markpieszak/ng-application-insights'

@Injectable()
export class SecurityHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router, private appInsightsService: AppInsightsService) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {           
        // Clone the request to add the new header.
        // const authReq = req.clone({ headers: req.headers.set("headerName", "headerValue")});        
        // console.log("Sending request with new header now ...");
        
        return next.handle(req).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do stuff with response if you want
              this.appInsightsService.trackEvent(req.url, req.body);
            }
          }, (err: any) => {            
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {                                                
                window.location.href=environment.login_url;
              } else {
                this.appInsightsService.trackEvent(req.url, req.body);
              }
            }
        });                 
    }
}