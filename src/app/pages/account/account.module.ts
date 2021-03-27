import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { AddressesComponent } from './addresses/addresses.component';
import { OrdersComponent } from './orders/orders.component';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../app.models';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatRadioChange } from '@angular/material';
import { OrderDialogComponent } from './orders/order-dialog/order-dialog.component';
import { OrderviewDialogueComponent } from './orders/orderview-dialogue/orderview-dialogue.component';
import { PurchasedItemsComponent } from './purchased-items/purchased-items.component';
import { CustomerCheckListComponent } from './customer-check-list/customer-check-list.component';
import { OrderImageViewerComponent } from './orders/order-image-viewer/order-image-viewer.component';
import { ShippingAddressComponent } from './addresses/shipping-address/shipping-address.component';


export const routes = [
  {
    path: '',
    component: AccountComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
      { path: 'information', component: InformationComponent, data: { breadcrumb: 'Information' } },
      { path: 'addresses', component: AddressesComponent, data: { breadcrumb: 'Addresses' } },
      { path: 'orders', component: OrdersComponent, data: { breadcrumb: 'Orders' } },
      { path: 'purchased', component: PurchasedItemsComponent, data: { breadcrumb: 'purchased' } },
      { path: 'checklist', component: CustomerCheckListComponent, data: { breadcrumb: 'checklist' } }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    OrderDialogComponent
  ],
  declarations: [
    AccountComponent,
    DashboardComponent,
    InformationComponent,
    AddressesComponent,
    OrdersComponent,
    OrderDialogComponent,
    OrderviewDialogueComponent,
    PurchasedItemsComponent,
    CustomerCheckListComponent,
    OrderImageViewerComponent,
    ShippingAddressComponent
  ],
  entryComponents: [
    OrderDialogComponent,
    OrderviewDialogueComponent,
    OrderImageViewerComponent,

  ],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class AccountModule { }
