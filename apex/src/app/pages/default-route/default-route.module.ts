import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DefaultRouteComponent } from 'app/pages/default-route/default-route.component';
import { DefaultRouteRoutingModule } from 'app/pages/default-route/default-routing.module';

@NgModule({
    imports: [
        CommonModule,
        DefaultRouteRoutingModule
    ],
    declarations: [       
        DefaultRouteComponent
    ]
})
export class DefaultRouteModule { }
