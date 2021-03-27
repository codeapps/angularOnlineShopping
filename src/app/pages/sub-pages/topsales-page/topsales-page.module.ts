import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopsalesPageComponent } from './topsales-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
export const routes = [
  { path: '', component: TopsalesPageComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [TopsalesPageComponent],
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
export class TopsalesPageModule { }
