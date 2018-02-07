import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'operator-card',
  templateUrl: './operator-card.component.html'
})

export class OperatorCardComponent implements OnInit {  

  @Input() person: any;  

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {
    
  }
}