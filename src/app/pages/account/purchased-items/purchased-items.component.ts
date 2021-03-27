import { Component, OnInit } from '@angular/core';
import {  CartItem, Product } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CartService, CategoryService } from 'src/app/services';

@Component({
  selector: 'app-purchased-items',
  templateUrl: './purchased-items.component.html',
  styleUrls: ['./purchased-items.component.scss']
})
export class PurchasedItemsComponent implements OnInit {

  products: Array<Product> = [];
  AcId = localStorage.getItem("CusEShopId");
  branchId = localStorage.getItem("SessionBranchId");
  errorFlag: boolean = false;
  CategoryLists: any = [];
  tempProducts: any = [];
  step = 0;
  ddProductsFlag: boolean;
  expand: boolean;
  multiple: boolean;
  folder: string = '';
  constructor(public appService: AppService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public dialog: MatDialog, public router: Router) {

    }

  setStep(index: number) {
    this.step = index;
  }

  ngOnInit() {
    this.appService.getImagePath.subscribe(res => {
      this.folder = res;
      this.fnCustomerPurchasedItemOnAcId();
    });

  }

  fnCustomerPurchasedItemOnAcId() {
    var ItemProduct = [];

    var ServiceParams = {};
    ServiceParams['strProc'] = 'CustomerPurchasedItemOnAcId';
    ServiceParams['JsonFileName'] = 'JsonScriptThree';

    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsAcId';
    ProcParams['strArgmt'] = this.AcId.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
      .toPromise().then(data => {
        var jsonproducts = JSON.parse(data.JsonDetails[0]);
        if (jsonproducts.length === 0) {
          this.errorFlag = true;
        }

        for (let product of jsonproducts) {
          let images = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ';

          if (product.ImageLoc && this.folder) {
            images = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${product.ImageLoc}`;
          }

          let customObj = new Product(

            product.ProductId,
            product.ItemDesc,
            [
              {
                'small': images,
                'medium': images,
                'big': images
              }
            ],
            product.MRP,
            product.SelRate,
            0,
            parseFloat(product.Discount || 0),
            product.ProductId,
            product.ProductId,
            product.ProdSpecification,
            parseFloat(product.BalanceQty || 0),
            0,
            product.ProductId,
            product.ProductId,
            product.ProductId,
            product.CategoryId,
            0,
            product.Manufacture_Id,
          );
          ItemProduct.push(customObj);

          this.fngetCategories();
        }
        // this.products = ItemProduct;
        this.tempProducts = ItemProduct;
      });

  }


  fngetCategories() {
    this.categoryService.onGetAllCategoriesInAcId(this.AcId)
      .toPromise().then(data => {
      let _data: any = data;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.CategoryLists = jsonData;
    })

  }


  fnFilterWishLists(val){
    const Data = this.tempProducts.filter(x=>x.categoryId === val);
    return Data;
  }


}
