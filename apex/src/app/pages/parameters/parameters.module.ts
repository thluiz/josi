import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { RouterModule } from '@angular/router';

import { NgbModal, 
    NgbDateStruct, 
    NgbDatepickerI18n, 
    NgbDatepickerModule,
    NgbCalendar, 
    NgbTimeStruct,      
    ModalDismissReasons, 
    NgbTimepickerModule,
    NgbActiveModal,
    NgbModule     
} from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

import { ParametersRoutingModule } from 'app/pages/parameters/parameters-routing.module';

import { AccountsPageComponent } from 'app/pages/parameters/accounts/accounts-page.component';
import { AcquirersPageComponent } from 'app/pages/parameters/acquirers/acquirers-page.component';
import { BranchesPageComponent } from 'app/pages/parameters/branches/branches-page.component';
import { DomainsPageComponent } from 'app/pages/parameters/domains/domains-page.component';
import { OverviewPageComponent } from 'app/pages/parameters/overview/overview-page.component';
import { PaymentMethodsPageComponent } from 'app/pages/parameters/payment-methods/payment-methods-page.component';
import { BranchDetailPageComponent } from 'app/pages/parameters/branch-detail/branch-detail-page.component';
import { ProductsPageComponent } from 'app/pages/parameters/products/products-page.component';

@NgModule({
    imports: [
        ParametersRoutingModule,
        CommonModule,
        FormsModule,                                 
        ReactiveFormsModule,                        
        NgbModule        
    ],
    declarations: [    
        OverviewPageComponent,
        BranchesPageComponent,
        AcquirersPageComponent,
        DomainsPageComponent,
        AccountsPageComponent,
        PaymentMethodsPageComponent,
        BranchDetailPageComponent,
        ProductsPageComponent
    ]
})
export class ParametersModule { }
