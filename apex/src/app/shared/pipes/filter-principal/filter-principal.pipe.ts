import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'onlyPrincipal', pure: false})
export class FilterPrincipalPipe implements PipeTransform {
  transform(entity: any[]): any[] {     
    if(!entity) {    
        return [];
    }
    return entity.filter(e => e.principal);
  }
}