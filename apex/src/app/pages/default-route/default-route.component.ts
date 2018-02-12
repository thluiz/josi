import { SecurityService } from 'app/services/security-service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './default-route.component.html',
  styleUrls: ['./default-route.component.scss']
})
export class DefaultRouteComponent implements OnInit {
  constructor(private securityService: SecurityService,               
              private router: Router) {
    
  }

  ngOnInit(): void {
    this.securityService.getCurrentUserData().subscribe((user) => {
      this.router.navigateByUrl(user.default_page_url || '/diary');
    });
  }
}
