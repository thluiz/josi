import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'person-status-line',
  templateUrl: './person-status-line.component.html'
})

export class PersonStatusLineComponent implements OnInit {  

  @Input() person: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {
    
  }
}