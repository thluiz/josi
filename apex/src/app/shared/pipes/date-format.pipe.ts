import { format } from 'date-fns';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateFormatFromServer"
})
export class dateFormatFromServerPipe implements PipeTransform {

  transform(value: string, timezone_variation: number) {
    const date = new Date(new Date(value + '+00:00').getTime()
                  + ((new Date()).getTimezoneOffset() * 60000)
                  - (timezone_variation * 60 * 60000));

    console.log(value);
    console.log(date);
    console.log(timezone_variation);

    return format(date, 'HH:mm');
  }
}
