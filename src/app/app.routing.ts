import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ConnectionerrorComponent } from './pages/connectionerror/connectionerror.component';
import { DashBoardComponent } from './admin-page/dash-board/dash-board.component';
import { CreateBannerPageComponent } from './admin-page/BannerPage/create-banner-page/create-banner-page.component';
import { EditListComponent } from './admin-page/edit-list/edit-list/edit-list.component';
import { SliderPageEditingComponent } from './admin-page/slider-page/slider-page-editing/slider-page-editing.component';
import { SliderPageComponent } from './admin-page/slider-page/slider-page.component';
import { EditProductComponent } from './admin-page/edit-product/edit-product/edit-product.component';
import { ManufactureBranchEditComponent } from './admin-page/manufacture-branch-edit/manufacture-branch-edit.component';
import { EditBrandsListComponent } from './admin-page/edit-brands-list/edit-brands-list.component';
import { OfferSettngsComponent } from './admin-page/offer-settngs/offer-settngs.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: '',
        component: PagesComponent, children: [
            { path: 'home', loadChildren: './pages/home/home.module#HomeModule' },
            { path: 'account', loadChildren: './pages/account/account.module#AccountModule', data: { breadcrumb: 'Account Settings' } },
            { path: 'compare', loadChildren: './pages/compare/compare.module#CompareModule', data: { breadcrumb: 'Compare' } },
            { path: 'wishlist', loadChildren: './pages/wishlist/wishlist.module#WishlistModule', data: { breadcrumb: 'Wishlist' } },
            { path: 'cart', loadChildren: './pages/cart/cart.module#CartModule', data: { breadcrumb: 'Cart' } },
            { path: 'checkout', loadChildren: './pages/checkout/checkout.module#CheckoutModule', data: { breadcrumb: 'Checkout' } },
            { path: 'contact', loadChildren: './pages/contact/contact.module#ContactModule', data: { breadcrumb: 'Contact' } },
            { path: 'sign-in', loadChildren: './pages/sign-in/sign-in.module#SignInModule', data: { breadcrumb: 'Sign In ' } },
            { path: 'brands', loadChildren: './pages/brands/brands.module#BrandsModule', data: { breadcrumb: 'Brands' } },
            { path: 'products', loadChildren: './pages/products/products.module#ProductsModule', data: { breadcrumb: 'All Products' } },
            // { path: 'productswithdd', loadChildren: './pages/product-withdd-list/product-withdd-list.Module#ProductWithddListModule', data: { breadcrumb: 'All Products' } },

            { path: 'categories', loadChildren: './pages/sub-pages/categories-page/categories-page.module#CategoriesPageModule', data: { breadcrumb: 'Categories Products' } },
            { path: 'features', loadChildren: './pages/sub-pages/feature-page/feature-page.module#FeaturePageModule', data: { breadcrumb: 'Feature Products' } },
            { path: 'topsales', loadChildren: './pages/sub-pages/topsales-page/topsales-page.module#TopsalesPageModule', data: { breadcrumb: 'Top Products' } },
            { path: 'categories-products', loadChildren: './pages/sub-pages/category-product/category-product.module#CategoryProductModule', data: { breadcrumb: 'Category Products' } },

            { path: 'admin', component: DashBoardComponent },
            { path: 'bannerCreate', component: CreateBannerPageComponent },
            { path: 'editList', component: EditListComponent },
            { path: 'sliderEditing', component: SliderPageEditingComponent },
            { path: 'slider', component: SliderPageComponent },
            { path: 'editProduct', component: EditProductComponent },
            { path: 'editManufactureBranch', component: ManufactureBranchEditComponent },
            { path: 'editbrands', component: EditBrandsListComponent },
            { path: 'offers', component: OfferSettngsComponent },
        ]
    },
    // { path: 'brands', component: BranchwiseProductComponent},
    { path: 'offline', component: ConnectionerrorComponent },
    { path: '**', component: NotFoundComponent },



];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    useHash: true
});
