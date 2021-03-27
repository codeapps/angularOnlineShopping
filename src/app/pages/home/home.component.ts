import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Product } from '../../app.models';
import { Router } from '@angular/router';
import {  LocalStorageService, ManufactureService } from 'src/app/services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  public brands: any = [];
  public banners = [];
  public featuredProducts: Array<Product>;
  public onSaleProducts: Array<Product>;
  public topRatedProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;

  ProductType: any;
  jsonproducts: any;
  imgFolder: string = '';

  constructor(public appService: AppService,
    private _localstorage: LocalStorageService,
    private manufactureService: ManufactureService,

    public router: Router) { }

  ngOnInit() {
    this.ProductType = [];

  }

  ngAfterViewInit(): void {
    this.appService.getImagePath.subscribe(res => {
      if (res) {
        this.imgFolder = res;
      }

    });
      this.appService.assignBranchId.subscribe(res => {
        if (res)
        this.getBrands(res);
        else
          this.getBrands(this._localstorage.getItem("SessionBranchIdWeb"));
      });

  }

   fngetProductCategory() {
     this.appService.fnProductTypeGets()
       .toPromise().then(data => {
      this.ProductType = data;
    })
  }

  // public getBanners() {
  //   this.appService.getBanners().subscribe(data => {
  //   });
  // }

  public getBrands(val) {
    this.manufactureService.getBrands(val)
      .toPromise().then(data => {
      let jsonData = JSON.parse(data.JsonDetails[0]);
      this.brands = jsonData;

      if (this.brands.length > 0) {
        this.brands.map(x => x.image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imgFolder}/${x.image}`)
      }
      }).finally(() => {
        this.fngetProductCategory();
    })


  }

getRandomInt() {
    return Math.floor(100000 + Math.random() * 900000);
  }


// featured products
  // fnProductGetsOnProductType(dProductTypeId, value) {

  //   var ServiceParams = {};
  //   ServiceParams['strProc'] = 'ProductGetsOnProductTypeId';

  //   var oProcParams = [];

  //   var ProcParams = {};
  //   ProcParams['strKey'] = 'ProductType_Id';
  //   ProcParams['strArgmt'] = dProductTypeId;
  //   oProcParams.push(ProcParams);

  //   ServiceParams['oProcParams'] = oProcParams;

  //   let body = JSON.stringify(ServiceParams);
  //   this.appService.post('CommonQuery/fnGetDataReportNew', body)
  //     .toPromise().then(data => {

  //       this.jsonproducts = JSON.parse(data);
  //       let dataPush = [];
  //       for (const product of this.jsonproducts) {

  //         let images = 'assets/images/placeholder/download.png';

  //         if (product.ImageLoc && this.appService.getImagePath) {
  //           images = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.appService.getImagePath}/${product.ImageLoc}`;
  //         }

  //         let customObj = null;
  //         customObj = new Product(

  //           product.ProductId,
  //           product.ItemDesc,
  //           [
  //             {small:images, medium:images, big:images }
  //           ],
  //           product.MRP,
  //           product.SelRate,
  //           product.ProductId,
  //           parseFloat(product.Discount || 0),
  //           product.ProductId,
  //           product.ProductId,
  //           product.ProdSpecification,
  //           parseFloat(product.BalanceQty || 0),
  //           0,
  //           product.ProductId,
  //           product.ProductId,
  //           product.ProductId,
  //           product.CategoryID,
  //           product.SpecificationMain_Id,
  //           product.Manufacture_Id
  //         );
  //         dataPush.push(customObj);
  //       }
  //       if (value === 'featured') {
  //         this.featuredProducts = dataPush;
  //       }

  //       if (value === 'on sale') {
  //         this.onSaleProducts = dataPush;

  //       }
  //       if (value === 'top rated') {
  //         this.topRatedProducts = dataPush;
  //       }
  //       if (value === 'new arrivals') {

  //         this.newArrivalsProducts = dataPush;
  //       }

  //     }, error => console.error(error));

  // }


}
