
import { Component, HostListener, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/app.models';
import { ProductDialogComponent } from 'src/app/shared/products-carousel/product-dialog/product-dialog.component';

import { SelectionModel } from '@angular/cdk/collections';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.scss']
})
export class CategoryProductComponent implements OnInit {

  type: boolean = false;
  tempProducts: any;
  Manafacture: any;
  brandSearch: string = '';
  checkedBrandData = [];
  avilableProduct: boolean;
  loading: boolean;
  categoryHeadId: any;
  tempProductsForBrands: any;
  tempData: any[];
  dTempCategoryID: any;
  tempManufactures: any = [];

  brandSelection = new SelectionModel<any>(true, []);
  constructor(public appService: AppService, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, private _localStorage: LocalStorageService,
    private router: Router) {

  }
  private sub: any;
  public imagpath = '';
  public viewType: string = 'grid';
  public viewCol = 25;
  viewHeight: string;
  public counts = [12, 24, 36];
  public count: any;
  public sortings = ['Sort by Default', 'Lowest first', 'Highest first'];
  public sort: any;

  public products: Array<Product> = [];
  public page: any;
  SortBy = 'order by itemdesc';
  tembBranchId: any;
  sessionWebBranchId: any = this._localStorage.getItem("SessionBranchIdWeb");
  categoriesLists: any = [];
  public sidenavOpen = true;

  ngOnInit() {

    this.loading = true;
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }
    if (this.viewCol > 30) {
      this.viewHeight = '1432px';
    } else {
      this.viewHeight = '1074px';
    }

    this.tembBranchId = this._localStorage.getItem('SessionBranchId');
    if (this.tembBranchId == null) {
      this.tembBranchId = 0;
    }


    this.count = this.counts[0];
    this.sort = this.sortings[0];


    if (window.innerWidth < 1280) {
      this.viewCol = 25;
    }

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.categoryHeadId = params.name;
      // setTimeout(() => {

      // }, 400);
      this.appService.getImagePath.subscribe(data => {
        this.imagpath = data;
        this.fnProductsGets(params.name);
      })
    });
  }
  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
    if (this.viewCol > 30) {
      this.viewHeight = '1432px';
    } else {
      this.viewHeight = '1074px';
    }
  }


  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
    if (this.viewCol > 30) {
      this.viewHeight = '1432px';
    } else {
      this.viewHeight = '1074px';
    }
  }

  public changeSorting(sort) {
    this.sort = sort;
    if (this.sort == 'Sort by Default') {
      this.SortBy = 'order by itemdesc';
    } else if (this.sort == 'Lowest first') {
      this.SortBy = 'order by SelRate  asc,ItemDesc asc';
    } else {
      this.SortBy = 'order by SelRate  desc,ItemDesc asc';
    }

  }

  public changeCount(count) {
    this.count = count;
    this.type = false;
    // this.getAllProducts();
  }


  public openProductDialog(product) {
    const ItemProduct = { product: product }
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: ItemProduct,
      panelClass: 'product-dialog'
    });
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }



  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  ngAfterContentInit(): void {

  }

  fnProductsGets(value) {
    let localStrPrice: any = this._localStorage.getItem('SessionPriceMenuId');
    let dTempPriceMenuId = 0;
    if (localStrPrice == null || localStrPrice == 'null') {
      dTempPriceMenuId = 0;
    } else {
      dTempPriceMenuId = localStrPrice;
    }

    this.dTempCategoryID = value;
    var ItemProduct;
    ItemProduct = [];
    let tempProd = [];
    var ServiceParams = {};
    ServiceParams['strProc'] = 'ProductsCategoryPages';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';

    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsCategoryHeadId';
    ProcParams['strArgmt'] = value.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsProductTypeId';
    ProcParams['strArgmt'] = '1';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsSortBy';
    ProcParams['strArgmt'] = this.SortBy;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsSpecificationIds';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsPriceMenuId';
    ProcParams['strArgmt'] = dTempPriceMenuId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.sessionWebBranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFileDiff', body)
      .toPromise().then(data => {
        var Result = data;
        let jsonproducts = JSON.parse(Result.JsonDetails);

        for (const catProduct of jsonproducts) {

         let images = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ';

          if (catProduct.ImageLoc) {
            images = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imagpath}/${catProduct.ImageLoc}`;
          }

          if (catProduct.prodcutGrpId != 0) {
            let customObj = new Product(

              catProduct.ProductId,
              catProduct.ItemDesc,
              [
                {
                  small: images,
                  medium: images,
                  big: images
                }
              ],
              catProduct.MRP,
              catProduct.SelRate,
              catProduct.SpecificationId,
              parseFloat(catProduct.Discount || 0),
              catProduct.ProductId,
              catProduct.ProductId,
              catProduct.ProdSpecification,
              parseFloat(catProduct.BalanceQty || 0),
              0,
              catProduct.ProductId,
              catProduct.ProductId,
              catProduct.ProductId,
              catProduct.CategoryCode,
              catProduct.SpecificationMain_Id,
              catProduct.Manufacture_Id,
              // catProduct.prodcutGrpId
            );
            tempProd.push(customObj);
          } else {

            let customObj = new Product(

              catProduct.ProductId,
              catProduct.ItemDesc,
              [
                {
                  small: images,
                  medium: images,
                  big: images
                }
              ],
              catProduct.MRP,
              catProduct.SelRate,
              catProduct.SpecificationId,
              parseFloat(catProduct.Discount || 0),
              catProduct.ProductId,
              catProduct.ProductId,
              catProduct.ProdSpecification,
              parseFloat(catProduct.BalanceQty || 0),
              0,
              catProduct.ProductId,
              catProduct.ProductId,
              catProduct.ProductId,
              catProduct.CategoryCode,
              catProduct.SpecificationMain_Id,
              catProduct.Manufacture_Id,
              // jsonproducts[i].prodcutGrpId
            );
            ItemProduct.push(customObj);
          }
        }

        const distinctThings = tempProd.filter(
          (ProductwithDD, i, arr) => arr.findIndex(t => t.productGroupId === ProductwithDD.productGroupId) === i
        );
        this.products = ItemProduct;
        this.products = this.products.concat(distinctThings);
        this.tempData = tempProd;
        if (this.products.length == 0) {
          this.avilableProduct = true;
        } else {
          this.avilableProduct = false;
        }
        this.tempProducts = this.products;
        this.tempProductsForBrands = ItemProduct;
        this.fnManafactureGetAll(value);
        this.loading = false;
      }, err => console.error(err));

  }
  fnCategoresList(value) {
    let strQuery = ``;
    if (this.sessionWebBranchId == 0) {
      strQuery = `select * from category inner join CategoryHead on Category.CategoryHead_Id = CategoryHead.CategoryHead_Id
      where Category.CategoryHead_Id = ${value}`;
    } else {
      strQuery = `select distinct CategoryID,Category.* from Category inner join Product on Category.CategoryID = Product.CategoryCode
      inner join CategoryHead on CategoryHead.CategoryHead_Id = Category.CategoryHead_Id
      inner join stock on Stock.ProductId = Product.ProductId
      where Stock.BranchId = ${this.sessionWebBranchId} and Category.CategoryHead_Id = ${value} `;
    }

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      var Result = data;
      this.categoriesLists = JSON.parse(Result.JsonDetails);
    });
  }

  fnFilterProducts(catId) {
    const Data = this.tempProducts.filter(x => x.categoryId == catId);
    this.products = Data;
    this.tempProductsForBrands = Data;

  }

  fnManafactureGetAll(val) {
    let strQuery = '';
    if (this.sessionWebBranchId == 0) {
      strQuery = `select distinct Manufacture.Manufacture_Id,Manufacture.* from Manufacture
       inner join Product on Manufacture.Manufacture_Id = Product.Manufacture_Id
       inner join Category on Product.CategoryCode = Category.CategoryID
       inner join CategoryHead on CategoryHead.CategoryHead_Id = Category.CategoryHead_Id
       where CategoryHead.CategoryHead_Id = ${val} `;
    } else {
      strQuery = `select distinct Manufacture.Manufacture_Id,Manufacture.* from Manufacture
      inner join Product on Manufacture.Manufacture_Id = Product.Manufacture_Id
        inner join Category on Product.CategoryCode = Category.CategoryID
        inner join CategoryHead on CategoryHead.CategoryHead_Id = Category.CategoryHead_Id
        inner join stock on Product.ProductId = stock.ProductId
        where CategoryHead.CategoryHead_Id = ${val} and Stock.BranchId = ${this.sessionWebBranchId}`;
    }

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(data => {
        let IssueRouteHeadList = JSON.parse(data.JsonDetails[0]);
        this.Manafacture = IssueRouteHeadList;
        this.tempManufactures = IssueRouteHeadList;
        this.fnCategoresList(val);
      });
  }

  onChangeBrands(brand) {
    this.brandSelection.toggle(brand);
    let selections = this.brandSelection.selected;
    let itemGroup = [];
    this.tempProducts.map(item => {
      const validate = selections.find(x => x.Manufacture_Id == item.ManufactureId);
      if (validate) {
        itemGroup.push(item)
      }
    })

    this.products = itemGroup;
    if (itemGroup.length == 0) {
      this.products = this.tempProducts;
    }

    if (this.products.length > 0) {
      this.avilableProduct = false;
    } else {
      this.avilableProduct = true;
    }
  }
  getAvilableBrands(Id) {
    if (Id == undefined || Id == null || Id == '' || this.tempProductsForBrands == []) { return; }
    const Count: any = this.tempProductsForBrands.filter((value, index, array) => value.ManufactureId == Id);
    const CountLength = Count.length;
    return CountLength;
  }

  fnGetManufacturesWithCategoryId(val) {
    let strQuery = '';
    if (this.sessionWebBranchId == 0) {
      strQuery = `select distinct Manufacture.Manufacture_Id,Manufacture.* from Manufacture
                inner join Product on Manufacture.Manufacture_Id = Product.Manufacture_Id
                inner join Category on Product.CategoryCode = Category.CategoryID
                where Category.CategoryID = ${val}`
    } else {
      strQuery = `select distinct Manufacture.Manufacture_Id,Manufacture.* from Manufacture
                    inner join Product on Manufacture.Manufacture_Id = Product.Manufacture_Id
                    inner join Category on Product.CategoryCode = Category.CategoryID
                    inner join stock on Stock.ProductId = Product.ProductId
                    where Category.CategoryID = ${val} and stock.BranchId = ${this.sessionWebBranchId} `
    }
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let IssueRouteHeadList = JSON.parse(data.JsonDetails[0]);
      this.Manafacture = IssueRouteHeadList;
      this.tempManufactures = IssueRouteHeadList;
    })
  }



  fnAssignProducts() {


    this.type = !this.type;
    if (this.type)
      this.count = 20
    else
      this.count = 12
  }

  showMore() {

    if (this.products.length > this.count) {
      this.count += 20;
    }
    if (this.products.length <= this.count)
      this.type = false;
  }



  fnRemoveChips(eve) {
    this.brandSelection.clear();
    let DataSource = [];
    DataSource = eve;
    for (const item of DataSource) {
      this.brandSelection.toggle(item);
    }

    let itemGroup = [];
    this.tempProducts.map(item => {
      const validate = DataSource.find(x => x.Manufacture_Id == item.ManufactureId);
      if (validate) {
        itemGroup.push(item)
      }
    })

    this.products = itemGroup;
    if (itemGroup.length == 0) {
      this.products = this.tempProducts;
    }

    if (this.products.length > 0) {
      this.avilableProduct = false;
    } else {
      this.avilableProduct = true;
    }

  }
}
