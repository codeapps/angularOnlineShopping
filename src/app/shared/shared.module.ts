import { FooterComponent } from './../theme/components/footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule, MatTreeModule
} from '@angular/material';
//  import {MatTreeModule} from '@angular/material/tree';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

import { PipesModule } from '../theme/pipes/pipes.module';
import { RatingComponent } from './rating/rating.component';
import { ControlsComponent } from './controls/controls.component';
import { MainCarouselComponent } from './main-carousel/main-carousel.component';
import { BrandsCarouselComponent } from './brands-carousel/brands-carousel.component';
import { ProductsCarouselComponent } from './products-carousel/products-carousel.component';
import { ProductDialogComponent } from './products-carousel/product-dialog/product-dialog.component';
import { BannersComponent } from './banners/banners.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoriesListComponent } from './categoriesList/categories-list.component';
import { OffersBannerComponent } from '../pages/offers-banner/offers-banner.component';
import { TopsalesproductsComponent } from '../pages/topproducts/topsalesproducts/topsalesproducts.component';
import { FeatureProductComponent } from '../pages/topproducts/feature-product/feature-product.component';
import { ProductsOnPriceComponent } from '../pages/topproducts/products-on-price/products-on-price.component';
import { RecentviewProductsComponent } from '../pages/topproducts/recentview-products/recentview-products.component';
import { ProductComponent } from '../pages/products/product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashBoardComponent } from '../admin-page/dash-board/dash-board.component';
import { CreateBannerPageComponent } from '../admin-page/BannerPage/create-banner-page/create-banner-page.component';
import { ButtonRendererComponent } from '../admin-page/BannerPage/button-renderer.component';
import { AgGridModule } from 'ag-grid-angular';
import { EditListComponent } from '../admin-page/edit-list/edit-list/edit-list.component';
import { SliderPageEditingComponent } from '../admin-page/slider-page/slider-page-editing/slider-page-editing.component';
import { SliderPageComponent } from '../admin-page/slider-page/slider-page.component';
import { EditProductComponent } from '../admin-page/edit-product/edit-product/edit-product.component';
import { WebcamModule } from 'ngx-webcam';
import { groupDialog, ManufactureBranchEditComponent } from '../admin-page/manufacture-branch-edit/manufacture-branch-edit.component';
import { EditBrandsListComponent } from '../admin-page/edit-brands-list/edit-brands-list.component';
import { OfferSettngsComponent } from '../admin-page/offer-settngs/offer-settngs.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { ScodeautocompleteComponent } from '../admin-page/scodeautocomplete/scodeautocomplete.component';
import { AgmCoreModule } from '@agm/core';
import { FooterCopyComponent } from '../theme/components/footer-copy/footer-copy.component';
import { pincodeDialog } from '../pages/sign-in/sign-in.component';
import { FilterComponent } from './filter/filter.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InputFileConfig, InputFileModule } from 'ngx-input-file';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

const config: InputFileConfig = {};
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputFileModule.forRoot(config),
    HttpModule,
    FormsModule,
    SwiperModule,
    // FlexLayoutModule,
    FlexLayoutModule.withConfig({ssrObserveBreakpoints: ['xs', 'lt-md']}),
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MatTreeModule,
    PerfectScrollbarModule,
    PipesModule,
    VirtualScrollerModule,
    AgGridModule.withComponents([ButtonRendererComponent]),
    WebcamModule,
    VirtualScrollerModule,
    NgxPaginationModule,
    AngularFontAwesomeModule
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyA1rF9bttCxRmsNdZYjW7FzIoyrul5jb-s' // AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0
    // }),

  ],
  exports: [
    RouterModule,
    SwiperModule,
    ReactiveFormsModule,
    InputFileModule,
    HttpModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MatTreeModule,
    PerfectScrollbarModule,
    PipesModule,
    RatingComponent,
    ControlsComponent,
    FilterComponent,
    MainCarouselComponent,
    BrandsCarouselComponent,
    ProductsCarouselComponent,
    ProductDialogComponent,
    BannersComponent,
    CategoryListComponent,
    CategoriesListComponent,
    OffersBannerComponent,
    TopsalesproductsComponent,
    FeatureProductComponent,
    ProductsOnPriceComponent,
    RecentviewProductsComponent,
    ProductComponent,
    WebcamModule,
    FooterComponent,
    FooterCopyComponent,
    VirtualScrollerModule,
    ProductViewComponent,
    NgxPaginationModule,
    AngularFontAwesomeModule
  ],
  declarations: [
    RatingComponent,
    ControlsComponent,
    MainCarouselComponent,
    BrandsCarouselComponent,
    ProductsCarouselComponent,
    ProductDialogComponent,
    BannersComponent,
    CategoryListComponent,
    CategoriesListComponent,
    OffersBannerComponent,
    TopsalesproductsComponent,
    FeatureProductComponent,
    ProductsOnPriceComponent,
    RecentviewProductsComponent,
    ProductComponent,

    DashBoardComponent,
    CreateBannerPageComponent,
    ButtonRendererComponent,
    EditListComponent,
    SliderPageEditingComponent,
    SliderPageComponent,
    EditProductComponent,
    ManufactureBranchEditComponent,
    EditBrandsListComponent,
    OfferSettngsComponent,
    ScodeautocompleteComponent,
    FooterComponent,
    FooterCopyComponent,
    groupDialog,
    pincodeDialog,
    FilterComponent,
    ProductViewComponent
  ],
  entryComponents: [
    ProductDialogComponent,groupDialog,pincodeDialog
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ]
})
export class SharedModule { }
