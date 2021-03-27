import { Component, OnInit } from '@angular/core';
import {  Product } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { LocalStorageService, ProductsService } from 'src/app/services';

@Component({
  selector: 'app-topsalesproducts',
  templateUrl: './topsalesproducts.component.html',
  styleUrls: ['./topsalesproducts.component.scss']
})
export class TopsalesproductsComponent implements OnInit {

  public config: SwiperConfigInterface = {
    a11y: false,
    direction: 'horizontal',
    slidesPerView: 5,
    keyboard: true,
    observer:true,
    mousewheel: false,
    scrollbar: false,
    pagination: false,
    preloadImages: false,
    lazy: true,
    navigation: false,
    autoplay: true,

    // navigation: {
    //   nextEl: '.swiper-button-right',
    //   prevEl: '.swiper-button-left',
    // },
    breakpoints: {

      480: {
        slidesPerView: 1
      },
      600: {
        slidesPerView: 2,
      }
    }
  };

  tembBranchId: any;
  categoryName: any =[];
  products: Array<Product> = [];
  avilableProduct: boolean;
  productTypeId: any;
  imagpath  = '';
  constructor(private _localStorage: LocalStorageService,
    private prodService: ProductsService,public appService: AppService,
    public dialog: MatDialog) {


   }

  ngOnInit() {

    this.tembBranchId = this._localStorage.getItem('SessionBranchIdWeb');
    if (!this.tembBranchId) {
      this.tembBranchId = 0;
    }
    this.appService.getImagePath.subscribe(data => {
      this.imagpath = data;
      this.fngettopsales();
    });

  }

  fngettopsales() {

    var ItemProduct;
    ItemProduct = [];

    this.prodService.onTopSellingProducts(this.tembBranchId)
      .toPromise().then(data => {
       var Result = data;
        let jsonproducts = JSON.parse(Result.JsonDetails);

        let images: Array<any>;
       let arrayLength = 20;
       if (jsonproducts.length < 20) {
          arrayLength = jsonproducts.length;
       }
       for (var i = 0; i < arrayLength; i++) {

        this.productTypeId = jsonproducts[i].prodtypeId
         images = [];
         var book = null;
         if (jsonproducts[i].ImageLoc) {

           book = {
             'small': `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imagpath}/${jsonproducts[i].ImageLoc}`,
             'medium': `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imagpath}/${jsonproducts[i].ImageLoc}`,
             'big': `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imagpath}/${jsonproducts[i].ImageLoc}`
           };


         } else{
           book = {
             'small': 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ',
             'medium': 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ',
             'big': 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 '
           };

         }
         let customObj = new Product(

          jsonproducts[i].ProductId,
          jsonproducts[i].ItemDesc,
          [
            book
          ],
          jsonproducts[i].MRP,
          jsonproducts[i].SelRate,
          jsonproducts[i].SpecificationId,
          parseFloat(jsonproducts[i].Discount || 0),
          jsonproducts[i].ProductId,
          jsonproducts[i].ProductId,
          jsonproducts[i].ProdSpecification,
          parseFloat(jsonproducts[i].BalanceQty || 0),
          0,
          jsonproducts[i].ProductId,
          jsonproducts[i].ProductId,
          jsonproducts[i].ProductId,
          jsonproducts[i].categoryId,
          jsonproducts[i].SpecificationMain_Id,
          jsonproducts[i].Manufacture_Id
        );
         this.categoryName.push(jsonproducts[i].CategoryDesc)
         ItemProduct.push(customObj);
       }
       this.products = ItemProduct;

         if (this.products.length == 0) {
           this.avilableProduct = true;
         } else {
           this.avilableProduct = false;
         }

      }, err => console.error(err));

  }



}
