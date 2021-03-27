import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesPageComponent } from './categories-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

export const routes = [
  { path: '', component: CategoriesPageComponent, pathMatch: 'full' },
  { path: ':id', component: CategoriesPageComponent }
];

@NgModule({
  declarations: [CategoriesPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    SwiperModule,
    NgxPaginationModule,
    PipesModule,
    ScrollingModule
  ]
})
export class CategoriesPageModule { }
