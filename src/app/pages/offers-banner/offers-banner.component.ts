import { Component, OnInit } from '@angular/core';
import {  Product } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-offers-banner',
  templateUrl: './offers-banner.component.html',
  styleUrls: ['./offers-banner.component.scss']
})

export class OffersBannerComponent implements OnInit {

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 3.2,
    keyboard: true,
    observer:false,
    mousewheel: false,
    scrollbar: false,
    pagination: false,
    navigation: {
      nextEl: '.right-button',
      prevEl: '.left-button',
    },
    breakpoints: {

      480: {
        slidesPerView: 1
      },
      600: {
        slidesPerView: 2,
      }
    }
  };


  offerProduct: any;
  products: Array<Product> = [];
  avilableProduct: boolean;
  tempProducts: any;
  productTypeId: any;
  pricemenuId: any;
  tembBranchId: any;
  public counts = [12, 24, 36];
  public page: any = localStorage.getItem('SessionBranchId');
  public viewCol = 25;
  categoryName: any =[];
  text: string;
  localStrPrice = localStorage.getItem('SessionPriceMenuId');

  constructor(public appService:AppService,public dialog: MatDialog,private router: Router) { }

  ngOnInit() {
    this.text = "Make it Quick Shopping, Hurry up ......"
    if (this.tembBranchId == null) {
      this.tembBranchId = 0;
    }
    if (this.localStrPrice == null || this.localStrPrice == 'null') {
      this.pricemenuId = 0;
    } else {
      this.pricemenuId = this.localStrPrice;
    }
    setTimeout(() => {
    this.fngetOffer();
    },500);
  }
  fngetOffer() {

    var ItemProduct;
    ItemProduct = [];

    var ServiceParams = {};
    ServiceParams['strProc'] = 'productOffer';
    ServiceParams['JsonFileName'] = 'JsonScriptOne';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsSortBy';
    ProcParams['strArgmt'] = "'order by itemdesc'";
    oProcParams.push(ProcParams);

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsSpecificationsId';
    ProcParams['strArgmt'] = "''";
    oProcParams.push(ProcParams);

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamasPeicemenuId';
    ProcParams['strArgmt'] = this.pricemenuId;
    oProcParams.push(ProcParams);

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.tembBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFilesforBanner', body)
      .subscribe(data => {
       var Result = data;
       let jsonproducts = JSON.parse(Result.JsonDetails);
       for (const product of jsonproducts) {

        this.productTypeId = product.prodtypeId
         let images = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ';
         var book = null;
         if (product.ImageLoc && this.appService.getImagePath) {
           images = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.appService.getImagePath}/${product.ImageLoc}`;
         }
         let customObj = new Product(

          product.ProductId,
          product.ItemDesc,
          [
            {small: images, medium: images, big: images}
          ],
          product.MRP,
          product.SelRate,
          product.SpecificationId,
          parseFloat(product.Discount || 0),
          product.ProductId,
          product.ProductId,
          product.ProdSpecification,
          parseFloat(product.BalanceQty || 0),
          0,
          product.ProductId,
          product.ProductId,
          product.ProductId,
          product.categoryId,
          product.SpecificationMain_Id,
          product.Manufacture_Id
        );
         this.categoryName.push(product.CategoryDesc)
         ItemProduct.push(customObj);
       }
       this.products = ItemProduct;
       setTimeout(() => {
         this.config.observer = true;

       });
         if (this.products.length == 0) {
           this.avilableProduct = true;
         } else {
           this.avilableProduct = false;
         }
         this.tempProducts = this.products;
      }, err => console.error(err));

  }


  fnremoveOffer() {
    let strQuery ='delete from OfferSettings where getdate() > ToDate'
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      result => {
      }
    );
  }

  public openProductDialog(product) {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog'
    });
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

}
