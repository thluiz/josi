import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html'
})

export class PersonCardComponent implements OnInit {  

  @Input() person: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {
    
  }
}