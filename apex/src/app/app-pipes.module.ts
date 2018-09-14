import { dateFormatFromServerPipe } from "./shared/pipes/date-format.pipe";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [
  ],
  declarations: [
    dateFormatFromServerPipe
  ],
  exports: [
    dateFormatFromServerPipe
  ]
})
export class ApplicationPipesModule {}
