import { Component, Input } from '@angular/core';

@Component({
  selector: 'contact-listitem',
  templateUrl: './contact-listitem.component.html',
  styleUrls: ['./contact-listitem.scss'],
})
export class ContactListitemComponent {  
    
    @Input("contact") contact_data: any;

    constructor() {
            
    }  
}