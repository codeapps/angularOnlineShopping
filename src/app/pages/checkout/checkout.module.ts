import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { AddressesComponent } from '../account/addresses/addresses.component';
import { PaymentsComponent } from 'src/app/theme/components/payments/payments.component';

export const routes = [
  { path: '', component: CheckoutComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgxPayPalModule,

    SharedModule
  ],
  declarations: [
    CheckoutComponent,
    PaymentsComponent,
  ],
  entryComponents:[AddressesComponent],
})
export class CheckoutModule { }
