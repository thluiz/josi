import { SecurityService } from './../../services/security-service';
import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";

declare var $: any;
@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    menuItems: any[];
    current_user;

    constructor(private router: Router,
        private route: ActivatedRoute, 
        private securityService: SecurityService
        ) {
    }

    ngOnInit() {        
        $.getScript('./assets/js/app-sidebar.js');
        this.menuItems = ROUTES;

        console.log("aqui");
        this.securityService.getCurrentUserData().subscribe((data) => {            
            this.current_user = data;
        });
    }

}
