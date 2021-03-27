import { Component, OnInit, ViewChild, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { Product } from '../../app.models';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from '@angular/material';
import { LocalStorageService, ManufactureService, ProductsService, SpecificationService } from 'src/app/services';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss',]
})


export class ProductsComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;
  // checked: boolean
  public sidenavOpen = true;
  private sub: any;
  public viewType: string = 'grid';
  public viewCol = 25;
  public counts = [12, 24, 36];
  public count: any;
  public sortings = ['Sort by Default', 'Lowest first', 'Highest first'];
  public sort: any;
  private specificationMainIds = '';
  private brandIds = '';
  public products: Array<Product> = [];
  private tempProduct: Array<Product> = [];
  public totalCount = 0;
  public brands = [];
  public priceFrom: any = 0;
  public priceTo: any = 4000;
  public brandSearch: string = '';
  public manafactureData: Array<any> = [];
  public categoryHeadData: Array<any> = [];
  private countProducts: Array<any> = [];
  public priceList = [0, 100, 500, 1000, 2000, 5000];
  public minPrice = 0;
  public maxPrice = 5000;

  dTempCategoryDesc: any;
  dTempCategoryID: any;
  dTempCategoryHeadId: any;
  dTempProductTypeId: any;
  dTempPriceMenuId: any;

  SortBy = 'order by itemdesc';
  loading: boolean;

  brandSelection = new SelectionModel<any>(true, []);
  specificationSelection = new SelectionModel<any>(true, []);
  branchId: any;

  sessionWebBranchId: any = '';
  imgFolder: string;
  type: boolean = false;
  constructor(private activatedRoute: ActivatedRoute,
    public appService: AppService,
    private productService: ProductsService,
    private specificationService: SpecificationService,
    private manufactureService: ManufactureService,
    private _localStorage: LocalStorageService,
    private router: Router, private cdRef: ChangeDetectorRef) {

  }
  hasChild = (_: number, node: any) => !!node.child && node.child.length > 0;

  ngAfterViewChecked() {

    this.cdRef.detectChanges();


  }
  ngOnInit() {
    // this.appService.setFooterVisible(false);

    this.loading = true;
    let localStrPrice = this._localStorage.getItem('SessionPriceMenuId');
    let sessbranchId = this._localStorage.getItem("SessionBranchIdWeb");
    let branchId = sessbranchId ? sessbranchId : this._localStorage.getItem('SessionBranchId');

    this.sessionWebBranchId = branchId ? branchId : 0;
    this.branchId = branchId;
    this.dTempPriceMenuId = localStrPrice ? localStrPrice : 0;

    this.count = this.counts[0];
    this.sort = this.sortings[0];

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.dTempCategoryDesc = params['name'];
      this.dTempCategoryID = params['ID'];
      this.dTempCategoryHeadId = params['HeadId'];
      this.dTempProductTypeId = params['ProdTypeId'];
      this.appService.getImagePath.subscribe(res => {
        if (res) {
          this.imgFolder = res;
          this.OnManafactureGet();
        }

      });

    });


  }




  async onChangeSlider() {
    await this.fnProductsGets();
  }
  async onChangeFromPrice() {
    this.priceFrom = this.minPrice;
    await this.fnProductsGets();
  }

  async onChangeToPrice() {
    this.priceTo = this.maxPrice;
    await this.fnProductsGets();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;

  }

  public changeCount(count) {
    this.count = count;
    // this.getAllProducts();
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
    this.fnProductsGets();

  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public onChangeCategory(event) {
    if (event.target) {
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
    }
  }

  onClearAllFilter() {
    this.brandSelection.clear();
    this.specificationSelection.clear();
    this.specificationMainIds = '';
    this.brandIds = '';
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.priceFrom = 0;
    this.priceTo = 4000;
    this.fnProductsGets();
  }
  fnSpecificationGetsOnCategoryId() {
    this.specificationService.onSpecificationGetsOnCategoryId(this.dTempCategoryID)
      .toPromise().then(data => {
        this.categoryHeadData = JSON.parse(data.JsonDetails[0]);
      }).finally(() => {
        this.getSpecificationsSubGet();
        this.onClearAllFilter();
      })

  }

  getSpecificationsSubGet() {
    this.categoryHeadData.map(x => {
      let categoryId = String(x.CategoryId);
      let specificationId = String(x.SpecificationHead_Id);
      this.specificationService.onSpecificationSub(categoryId, specificationId)
        .subscribe(res => {
          let jsonSpecifySub = JSON.parse(res.JsonDetails[0]);
          x.name = x.SpecificationHead_Name,
            x.child = jsonSpecifySub
        }, error => console.error(error));
    });
  }
  brandCount:boolean = true;
  getAvilableBrands() {
    this.manafactureData.map(x => {
      x.count = this.tempProduct.filter((value, index, array) => value.ManufactureId == x.Manufacture_id).length;
    })
    if (this.brandCount) {
      let filterCount = this.manafactureData.filter(x => x.count != 0);
      this.manafactureData = filterCount
    }
    this.brandCount = false;
  }

  getAvilableCount(Id) {
    const Count = this.countProducts.find(value => value.SpecificationMain_Id == Id);
    if (Count)
      return Count.Noofitems;
    else
      return 0
  }



  onChangeBrands(brand) {

    let lastStr = '';
    this.brandSelection.toggle(brand)
    let selections = this.brandSelection.selected;
    let specId = '(';
    selections.map((x) => {
      specId += `${x.Manufacture_id},`;
    })
    lastStr = specId.substring(0, specId.length - 1);
    lastStr += ')';
    if (selections.length == 0)
      lastStr = '';

    this.brandIds = lastStr;
    this.fnProductsGets();

  }


  onChangeProduct(row) {
    let lastStr = '';
    this.specificationSelection.toggle(row)
    let selections = this.specificationSelection.selected;
    let specId = '';
    selections.map((x) => {
      specId += `${x.SpecificationMain_Id},`;
    })
    lastStr = specId.substring(0, specId.length - 1);
    this.specificationMainIds = lastStr;
    this.fnProductsGets();
  }

  onTotalCount() {

    if (this.brandSelection.isEmpty() &&
      this.specificationSelection.isEmpty() &&
      this.priceFrom == 0 && this.priceTo == 4000) {
      this.totalCount = this.tempProduct.length;
    }
  }

  async fnProductsGets() {
    this.products = [];
    this.loading = true;
    let itemArray = [];

    await this.productService.onProductGets(this.dTempCategoryID, this.dTempCategoryHeadId, this.dTempProductTypeId,
      this.SortBy, this.specificationMainIds, this.priceFrom, this.priceTo, this.dTempPriceMenuId, this.brandIds, this.branchId)
      .toPromise().then(data => {
        let jsonproducts = JSON.parse(data.JsonDetails[0]);
        this.countProducts = JSON.parse(data.JsonDetails[1]);

        const cartItems = this.appService.Data.cartList;

        for (let product of jsonproducts) {

          let image = 'assets/images/placeholder/download.png';
          if (product.ImageLoc) {
            image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imgFolder}/${product.ImageLoc}`
          }
          let cartCount = 0;
          if (cartItems.length) {
            let items = cartItems.find(x => product.ProductId == x.id)
            if (items)
              cartCount = items.cartCount;
          }


          let customObj = new Product(
            product.ProductId,
            product.ItemDesc,
            [
              { small: image, medium: image, big: image }
            ],
            product.MRP,
            product.SelRate,
            0,// product.SpecificationId,
            parseFloat(product.Discount || 0),
            product.ProductId,
            product.ProductId,
            '0',// product.ProdSpecification,
            parseFloat(product.BalanceQty || 0),
            cartCount,
            product.ProductId,
            product.ProductId,
            product.ProductId,
            this.dTempCategoryID,
            product.SpecificationMainId,
            product.Manufacture_Id,
            // product.prodcutGrpId
          );
          itemArray.push(customObj);
        }

        this.products = itemArray;
        this.tempProduct = itemArray;
        this.onTotalCount();
        if (this.specificationSelection.isEmpty() && this.brandSelection.isEmpty()) {
          this.getAvilableBrands();
        }
        this.loading = false;

      })

  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  OnManafactureGet() {
    let branchID = Number(this.sessionWebBranchId)
    this.manufactureService.onManufactureGet(branchID, this.dTempCategoryID)
      .toPromise().then(data => {
        let IssueRouteHeadList = JSON.parse(data.JsonDetails[0]);
        this.manafactureData = IssueRouteHeadList;


      }).finally(() => {
        this.fnSpecificationGetsOnCategoryId();
      })
  }



}
