import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'app/services/utils-service';

@Component({
  selector: 'contact-buttonitem',
  templateUrl: './contact-buttonitem.component.html',
  styleUrls: ['./contact-buttonitem.scss'],
})
export class ContactButtonitemComponent implements OnInit {  
    
    @Input("contact") contact_data: any;
    showContact = false;

    constructor(private utilsService: UtilsService) {
            
    }  

    ngOnInit() {
      this.contact_data.safe_url = this.link_to_contact(this.contact_data);
    }
  
    private link_to_contact(contact) {
      return this.utilsService.sanitize(contact.base_url + contact.contact);
    }
}