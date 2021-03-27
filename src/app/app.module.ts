import { BrowserModule } from '@angular/platform-browser';
import { APP_ID, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY, MAT_DATE_LOCALE } from '@angular/material';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { menuScrollStrategy } from './theme/utils/scroll-strategy';

import { SharedModule } from './shared/shared.module';
import {  routing } from './app.routing';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TopMenuComponent } from './theme/components/top-menu/top-menu.component';
import { MenuComponent } from './theme/components/menu/menu.component';
import { SidenavMenuComponent } from './theme/components/sidenav-menu/sidenav-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { AppSettings } from './app.settings';
import { AppService } from './app.service';
import { AppInterceptor } from './theme/utils/app-interceptor';
import { OptionsComponent } from './theme/components/options/options.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionerrorComponent } from './pages/connectionerror/connectionerror.component';
import { isPlatformBrowser } from '@angular/common';
import { SignInModule } from './pages/sign-in/sign-in.module';
import { ProductsModule } from './pages/products/products.module';
import { AccountModule } from './pages/account/account.module';
import { BrandsModule } from './pages/brands/brands.module';
import { CartModule } from './pages/cart/cart.module';
import { CheckoutModule } from './pages/checkout/checkout.module';
import { ContactModule } from './pages/contact/contact.module';
import { HomeModule } from './pages/home/home.module';
import { CategoriesPageModule } from './pages/sub-pages/categories-page/categories-page.module';
import { WishlistModule } from './pages/wishlist/wishlist.module';
import { CompareModule } from './pages/compare/compare.module';
import { CategoryProductModule } from './pages/sub-pages/category-product/category-product.module';
import { FeaturePageModule } from './pages/sub-pages/feature-page/feature-page.module';
import { TopsalesPageModule } from './pages/sub-pages/topsales-page/topsales-page.module';
import { SearchListsComponent } from './theme/components/search-lists/search-lists.component';
import { AlertModalComponent } from './theme/components/alert-modal/alert-modal.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient);
// }

@NgModule({
   imports: [
    BrowserModule.withServerTransition({ appId: 'codeapps-shopping' }),
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    SharedModule,

    routing,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    TopMenuComponent,
    MenuComponent,
    SidenavMenuComponent,
    BreadcrumbComponent,
    OptionsComponent,
    ConnectionerrorComponent,
    SearchListsComponent,
    AlertModalComponent,

  ],
  entryComponents:[AlertModalComponent],
  providers: [
    AppSettings,

    AppService,
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: MAT_MENU_SCROLL_STRATEGY, useFactory: menuScrollStrategy, deps: [Overlay] },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID)  platformId: object,
    @Inject(APP_ID) appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
