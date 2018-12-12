import { format } from 'date-fns';
import { Pipe, PipeTransform, OnInit } from "@angular/core";

@Pipe({
  name: "formatFromResponsibleTz"
})
export class dateFormatFromResponsibleTimezonePipe implements PipeTransform {

  transform(value: string, timezone_delta, date_format: string = 'HH:mm') {
    // all datetime are listed from server without timezone, adding timezone from location
    const stz = ((timezone_delta || -3) < 0 ? '-' : '+')
                + (Math.abs(timezone_delta || -3) < 10 ? '0' : '')
                + (Math.abs(timezone_delta  || -3).toString() + ':00');  //ex: -03:00

    const utc_date = new Date(value + stz);

    return format(utc_date, date_format);
  }
}
