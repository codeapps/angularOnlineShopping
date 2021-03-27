import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';
import { ProductZoomComponent } from './product/product-zoom/product-zoom.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

export const routes = [
  { path: '', component: ProductsComponent, pathMatch: 'full' },
  { path: ':name', component: ProductsComponent },
  { path: ':id/:name', component: ProductComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ScrollingModule
  ],
  declarations: [
    ProductsComponent,
    ProductZoomComponent
  ],
  entryComponents: [
    ProductZoomComponent
  ]
})
export class ProductsModule { }
