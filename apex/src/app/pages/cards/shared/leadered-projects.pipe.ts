import { Pipe, PipeTransform } from '@angular/core';

import { Card } from './../../../shared/models/card.model';

@Pipe({name: 'leaderedProjects', pure: false})
export class LeaderedProjectsPipe implements PipeTransform {
  transform(cards: Card[], leader: any): Card[] {     
    if(!cards) {    
        return [];
    }
    return cards.filter(cd => cd.leaders != null 
                            && cd.leaders.length > 0 
                            && cd.leaders[0].id == (leader.id || leader.person_id));
  }
}