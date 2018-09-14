import { ParameterService } from 'app/services/parameter-service';
import { format } from 'date-fns';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatFromServerTz"
})
export class dateFormatFromServerTimezonePipe implements PipeTransform {
  private serverTimezone = 0;

  constructor(private parameterService : ParameterService) {

  }

  transform(value: string, date_format: string = 'HH:mm') {
    // all datetime are listed from server without timezone, adding timezone variation
    const server_timezone = this.parameterService.server_timezone;
    const stz = (server_timezone < 0 ? '-' : '+')
                + (Math.abs(server_timezone) < 10 ? '0' : '')
                + Math.abs(server_timezone).toString() + ':00';  //ex: -03:00

    console.log(server_timezone);

    const utc_date = new Date(value + stz);

    return format(utc_date, date_format);
  }
}
