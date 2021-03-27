import { Component, OnInit, ViewChild } from '@angular/core';
import {  Product } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { ProductsService } from 'src/app/services';


@Component({
  selector: 'app-feature-product',
  templateUrl: './feature-product.component.html',
  styleUrls: ['./feature-product.component.scss']
})
export class FeatureProductComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: any;
  public config: SwiperConfigInterface = {

    direction: 'horizontal',
    slidesPerView: 7,
    keyboard: true,
    observer:true,
    mousewheel: false,
    scrollbar: false,
    pagination: false,
    preloadImages: false,
    lazy: true,
    navigation: {
      nextEl: '.swiper-button-right',
      prevEl: '.swiper-button-left',
    },
    breakpoints: {

      480: {
        slidesPerView: 1
      },
      600: {
        slidesPerView: 3,
      }
    }
  };


  categoryName: any =[];
  products: Array<Product> = [];
  avilableProduct: boolean;
  tempProducts: any;
  productTypeId: any;
  imagpath = '';
  constructor(public appService: AppService, private productService: ProductsService,
     public dialog: MatDialog, private router: Router) {

   }

  ngOnInit() {
    this.appService.getImagePath.subscribe(data => {
      this.imagpath = data;
    });
    this.appService.assignBranchId.subscribe(res => {
        if (res) {
          this.fngetFeatureProducts(res)
        }
    })
  }

 fngetFeatureProducts(branchId) {

    var ItemProduct;
    ItemProduct = [];

    this.productService.onFeaturedProducts(branchId)
      .subscribe(data => {
       var Result = data;
        let jsonproducts = JSON.parse(Result.JsonDetails);

       const result:any = data
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
        this.tempProducts = this.products;

      }, err => console.error(err));

  }

  onImgLoad(index: number) {
    this.swiper.nativeElement.swiper.lazy.loadInSlide(index);
  }
}
