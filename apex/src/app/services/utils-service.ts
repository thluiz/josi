import {Injectable} from '@angular/core';
@Injectable()
export class UtilsService {
constructor() { }

    translate_date_to_server(date) {
        if(!date || !date.year)
            return null;

        return `${date.year}-${date.month}-${date.day}`;
    }

}

