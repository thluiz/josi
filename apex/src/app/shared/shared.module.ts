import { NgModule } from '@angular/core';
 import { CommonModule } from "@angular/common";
 import { RouterModule } from "@angular/router";

 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ToggleFullscreenDirective } from "./directives/toggle-fullscreen.directive";
import { NotificationSidebarComponent } from "./notification-sidebar/notification-sidebar.component";
import { FormsModule } from '@angular/forms';


@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        NotificationSidebarComponent,
        SidebarComponent,
        ToggleFullscreenDirective,
        NgbModule
    ],
    imports:[
        RouterModule,
        CommonModule,
        FormsModule,
        NgbModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective
        ]
})
export class SharedModule { }
