import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturePageComponent } from './feature-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
export const routes = [
  { path: '', component: FeaturePageComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [FeaturePageComponent],
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
export class FeaturePageModule { }
