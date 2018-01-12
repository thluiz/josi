import { Component, HostBinding } from '@angular/core';

@Component({
    // moduleId: module.id,
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent{
    currentDate : Date = new Date();

    goToTop() {        
        document.body.scrollTop = 0; 
        document.documentElement.scrollTop = 0;
        window.scrollTo(0, 0);
    }
}
