import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  MatSidenav } from '@angular/material';
import { AppService } from '../../../app.service';
import {  Product} from '../../../app.models';
import { SelectionModel } from '@angular/cdk/collections';
import { LocalStorageService, ProductsService, SpecificationService } from 'src/app/services';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})

export class BrandComponent implements OnInit {

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
  private brandIds  = '';
  public products: Array<Product> = [];
  public categories:any[];
  public brands = [];
  public priceFrom: any = 0;
  public priceTo: any = 4000;
  public brandSearch: string = '';
  public categoryHeadData: Array<any> = [];
  private countProducts: Array<any> = [];
  private categoryId: string = '0';
  private headId: string = '0';
  dTempPriceMenuId:any = 0;

  SortBy = 'order by itemdesc';
  loading: boolean;


  specificationSelection = new SelectionModel<any>(true, []);
  branchId: any;

  public priceList = [0, 100, 500, 1000, 2000, 5000];
  public minPrice = 0;
  public maxPrice = 5000;
  public brandName: string;
  sessionWebBranchId: any = '';
  imgFolder: string;
  type: boolean = false;
  public categoryName: string = '';

  constructor(private activatedRoute: ActivatedRoute,
    public appService: AppService,
    private productService: ProductsService,
    private specificationService: SpecificationService,
    private _localStorage: LocalStorageService,
    private cdRef: ChangeDetectorRef) {
    this.sessionWebBranchId = _localStorage.getItem("SessionBranchIdWeb");
  }
  hasChild = (_: number, node: any) => !!node.child && node.child.length > 0;

  ngAfterViewChecked() {

    this.cdRef.detectChanges();


  }


  ngOnInit() {
    // this.appService.setFooterVisible(false);

    this.loading = true;
    let localStrPrice = this._localStorage.getItem('SessionPriceMenuId');

    if (localStrPrice == null || localStrPrice == 'null') {
      this.dTempPriceMenuId = 0;
    } else {
      this.dTempPriceMenuId = localStrPrice;
    }

    if (this.sessionWebBranchId == 0) {
      this.branchId = this._localStorage.getItem('SessionBranchId');
      if (this.branchId == null) {
        this.branchId = 0;
      }
    } else {
      this.branchId = this.sessionWebBranchId;
    }

    this.count = this.counts[0];
    this.sort = this.sortings[0];

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.brandName = params['name'];
      this.brandIds = params['ID'];
      // this.tembBranchId = params['BranchId'];
      this.appService.getImagePath.subscribe(res => {
        if (res) {
          this.imgFolder = res;
          this.fnProductsGets();
        }

      });


      setTimeout(() => {
        this.fngetCategoryList();
      });
    });

  }

  async onChangeFromPrice() {
    this.priceFrom = this.minPrice;
    await this.fnProductsGets();
  }

  async onChangeToPrice() {
    this.priceTo = this.maxPrice;
    await this.fnProductsGets();
  }

  ngAfterContentInit(): void {


  }

  async onChangeSlider() {
    await this.fnProductsGets();
  }

  fngetCategoryList() {
    let strQuery = '';
    if (!this.sessionWebBranchId) {
      strQuery = `select distinct Category.CategoryID,Category.*  from Category
                    inner join Product on Product.CategoryCode = Category.CategoryID
                    inner join Manufacture on Manufacture.Manufacture_Id = Product.Manufacture_Id
                    where Manufacture.Manufacture_Id = ${this.brandIds}`;
    } else {
      strQuery = `select distinct Category.CategoryID,Category.*  from Category
                        inner join Product on Product.CategoryCode = Category.CategoryID
                        inner join Manufacture on Manufacture.Manufacture_Id = Product.Manufacture_Id
                        inner join Stock on Stock.ProductId = Product.ProductId
                        where Manufacture.Manufacture_Id = ${this.brandIds} and Stock.BranchId = ${this.sessionWebBranchId}`;
    }
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(data => {
      let IssueRouteHeadList = JSON.parse(data.JsonDetails[0]);
        this.categories = IssueRouteHeadList;

    }).finally(() => {
      this.fnSpecificationGetsOnCategoryId();
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  changeCategory(item) {

    this.categoryId = item.CategoryID;
    this.headId = item.CategoryHead_Id;
    this.categoryName = item.CategoryDesc;
    this.fnProductsGets();
  }

  onClearAll() {
    this.specificationSelection.clear();
    this.priceFrom = 0;
    this.priceTo = 4000;
    this.SortBy = 'order by itemdesc';
    this.categoryId = '0';
    this.headId = '0';
    this.categoryName = '';
    this.fnProductsGets();

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


  fnSpecificationGetsOnCategoryId() {

    this.specificationService.onSpecificationHeadGetOnBrandId(this.brandIds)
      .toPromise().then(data => {
        this.categoryHeadData = JSON.parse(data.JsonDetails[0]);
      }).finally(() => {
        this.getSpecificationsSubGet();
      });
  }


  getSpecificationsSubGet() {
     this.categoryHeadData.map(x => {
      let specificationId = String(x.SpecificationHead_Id);
      this.specificationService.onSpecificationSubOnBrandId(specificationId, this.brandIds)
        .subscribe(res => {
          let jsonSpecifySub = JSON.parse(res.JsonDetails[0]);
            x.name = x.SpecificationHead_Name,
            x.child = jsonSpecifySub
        }, error => console.error(error));
    });
  }


  getAvilableCount(Id) {
    const Count = this.countProducts.find(value => value.SpecificationMain_Id == Id);
    if(Count)
      return Count.Noofitems;
    else
      return 0
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
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

  async fnProductsGets() {
    this.products = [];
    this.loading = true;
    let itemArray = [];
    let brandId = `(${this.brandIds})`
    await this.productService.onProductGets(this.categoryId, this.headId, '0',
      this.SortBy, this.specificationMainIds, this.priceFrom, this.priceTo,
      this.dTempPriceMenuId, brandId, this.branchId)
      .toPromise().then(data => {
        let jsonproducts = JSON.parse(data.JsonDetails[0]);
        this.countProducts = JSON.parse(data.JsonDetails[1]);

        for (let product of jsonproducts) {
          let image = 'assets/images/placeholder/download.png';
          if (product.ImageLoc) {
            image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imgFolder}/${product.ImageLoc}`;
          }
          let customObj = new Product(
            product.ProductId,
            product.ItemDesc,
            [
              {small: image, medium: image, big: image}
            ],
            product.MRP,
            product.SelRate,
            0,// product.SpecificationId,
            parseFloat(product.Discount || 0),
            product.ProductId,
            product.ProductId,
            '0',// product.ProdSpecification,
            parseFloat(product.BalanceQty || 0),
            0,
            product.ProductId,
            product.ProductId,
            product.ProductId,
            0,
            product.SpecificationMainId,
            product.Manufacture_Id,
            // product.prodcutGrpId
          );
          itemArray.push(customObj);
        }

        this.products = itemArray;

        this.loading = false;

      })

  }



}
