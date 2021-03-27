import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from 'src/app/app.models';
import { ProductDialogComponent } from 'src/app/shared/products-carousel/product-dialog/product-dialog.component';

@Component({
  selector: 'app-topsales-page',
  templateUrl: './topsales-page.component.html',
  styleUrls: ['./topsales-page.component.scss']
})
export class TopsalesPageComponent implements OnInit {

  constructor(public appService: AppService, public dialog: MatDialog, private router: Router) {
    this.appService.getImagePath.subscribe(data => {
      this.imagpath = data;
      this.fngettopsales();
    })

   }
   public imagpath = '';
  public viewType: string = 'grid';
  public viewCol = 20;
  public counts = [15, 30, 45];
  public count: any;
  public sortings = ['Sort by Default', 'Lowest first', 'Highest first'];
  public sort: any;

  public products: Array<Product> = [];
  public page: any;
  SortBy = 'order by itemdesc';
  tembBranchId: any;
  ngOnInit() {

    this.tembBranchId = localStorage.getItem('SessionBranchId');
    if (this.tembBranchId == null) {
      this.tembBranchId = 0;
    }


    this.count = this.counts[0];
    this.sort = this.sortings[0];


    if (window.innerWidth < 1280) {
      this.viewCol = 25;
    }

  }

  public changeViewType(viewType, viewCol) {

    this.viewType = viewType;
    this.viewCol = viewCol;


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
    // this.getAllProducts();
  }


  public openProductDialog(product) {
    const ItemProduct = {product: product};
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


  fngettopsales() {

    let ItemProduct;
    ItemProduct = [];

    let ServiceParams = {};
    ServiceParams['strProc'] = 'getTopSellingProducts';
    ServiceParams['JsonFileName'] = 'JsonScriptTwo';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.tembBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFilesforBanner', body)
      .subscribe(data => {
       var Result = data;
       let jsonproducts = JSON.parse(Result.JsonDetails);
       const result:any = data
       let images: Array<any>;

       for (var i = 0; i < jsonproducts.length ; i++) {

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

         ItemProduct.push(customObj);
       }
       this.products = ItemProduct;
      }, err => console.error(err));

  }
}
