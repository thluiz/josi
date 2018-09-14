import { dateFormatFromResponsibleTimezonePipe } from './shared/pipes/date-format-time-from-responsible-timezone.pipe';
import { dateFormatFromServerTimezonePipe } from "./shared/pipes/date-format-time-from-server-timezone.pipe";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [
  ],
  declarations: [
    dateFormatFromServerTimezonePipe,
    dateFormatFromResponsibleTimezonePipe
  ],
  exports: [
    dateFormatFromServerTimezonePipe,
    dateFormatFromResponsibleTimezonePipe
  ]
})
export class ApplicationPipesModule {}
