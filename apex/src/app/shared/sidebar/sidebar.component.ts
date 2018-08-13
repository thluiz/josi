import { SecurityService } from './../../services/security-service';
import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Result } from 'app/shared/models/result';

declare var $: any;
@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    menuItems: any[];
    current_user;
    logout_url = environment.logout_url;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private securityService: SecurityService
        ) {
    }

    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');
        this.menuItems = ROUTES;

        this.securityService.getCurrentUserData()
        .subscribe((result_user : Result<any>) => {
            this.current_user = result_user.data;
        });
    }

}
