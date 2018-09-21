import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { OwnershipTitleComponent } from './ownership-title.component';

import { NgPipesModule } from 'ngx-pipes';

import { ApplicationPipesModule } from 'app/app-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgPipesModule,
        ApplicationPipesModule
    ],
    declarations: [
      OwnershipTitleComponent
    ], exports: [
      OwnershipTitleComponent
    ]
})
export class OwnershipTitleModule { }
