import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryProductComponent } from './category-product.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: CategoryProductComponent, pathMatch: 'full' },
  { path: ':name', component: CategoryProductComponent },
];

@NgModule({
  declarations: [CategoryProductComponent],
  imports: [
    CommonModule,
    // AgGridModule.withComponents(ProductComponent),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    ScrollingModule
  ]
})
export class CategoryProductModule { }
