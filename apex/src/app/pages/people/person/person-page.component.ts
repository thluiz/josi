import { ActivatedRoute } from '@angular/router';
import { PersonService } from './../../../services/person-service';
import { Component } from '@angular/core';

import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.scss'],
  providers: [PersonService]
})
export class PersonPageComponent implements OnInit  {
  id: number;
  person: any;
  private sub: any;

  constructor(private personService: PersonService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];      
      
      this.personService.getAllData(this.id).subscribe(
        data => {           
          const result = data.json();    
          this.person = result;     
        }
      );      
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
