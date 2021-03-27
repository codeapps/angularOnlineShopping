import { Component, OnInit } from "@angular/core";
import { AppService } from "../../app.service";
import { Product } from "src/app/app.models";
import { LocalStorageService, ManufactureService } from "src/app/services";

@Component({
  selector: "app-brands",
  templateUrl: "./brands.component.html",
  styleUrls: ["./brands.component.scss"],
})
export class BrandsComponent implements OnInit {
  // public letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

  public products: Array<Product> = [];
  public brands = [];
  public searchText: string;

  displayValue: boolean;
  letters: any = [];
  tempProducts = [];
  tempBrandId: any = [];
  branchId: any;
  dTempPriceMenuId: any;
  dTempCategoryID: number;

  sessionWebBranchId: string = "";
  folder: string = "";
  constructor(
    public appService: AppService,
    private _localStorage: LocalStorageService,
    private brandService: ManufactureService,
  ) {
    this.sessionWebBranchId = _localStorage.getItem("SessionBranchIdWeb");
    this.appService.getImagePath.subscribe(res => {
      this.folder = res;
    });
  }

  ngOnInit() {
    // this.appService.setFooterVisible(false);

    if (!this.sessionWebBranchId) {
      this.branchId = this._localStorage.getItem("SessionBranchId");
      if (!this.branchId) {
        this.branchId = 0;
      }
    } else {
      this.branchId = this.sessionWebBranchId;
    }

    this.fngetAllProducts();


    this.brands.sort((a, b) => {
      if (a.Manufacture_Name < b.Manufacture_Name) return -1;
      if (a.Manufacture_Name > b.Manufacture_Name) return 1;
      return 0;
    });
  }

  fngetbranches() {
    let strQuery = "";

    if (!this.sessionWebBranchId) {
      strQuery = `select Manufacture.Manufacture_CSTNo2, Manufacture.Manufacture_Id,Manufacture.Manufacture_Name,Manufacture.BranchId,count(Product.ProductId) as counts from Manufacture
      inner join Product on Manufacture.Manufacture_Id = Product.Manufacture_Id
      inner join ProductSub on Product.ProductId = ProductSub.ProductId
	     where ProductSub.bOnline = 1 and ProductSub.BranchId = ${this.sessionWebBranchId}
      group by Manufacture.Manufacture_Id,Manufacture.Manufacture_Name,Manufacture.BranchId,Manufacture.Manufacture_CSTNo2 order by Manufacture_Name`;
    } else {
      strQuery = `select Manufacture.Manufacture_CSTNo2, Manufacture.Manufacture_Id,Manufacture.Manufacture_Name,Manufacture.BranchId,count(Product.ProductId) as counts from Manufacture
      inner join Product on Manufacture.Manufacture_Id = Product.Manufacture_Id left join Stock on Product.ProductId = Stock.ProductId
      inner join ProductSub on Product.ProductId = ProductSub.ProductId
       where Stock.BranchId =${this.sessionWebBranchId} and  ProductSub.bOnline = 1 and ProductSub.BranchId = ${this.sessionWebBranchId}
      group by Manufacture.Manufacture_Id,Manufacture.Manufacture_Name,Manufacture.BranchId,Manufacture.Manufacture_CSTNo2 order by Manufacture_Name`
    }

    let objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .subscribe(res => {

        const allbrands = JSON.parse(res.JsonDetails[0]);

        let count = 0;
        let brandid;
        for (const brand of allbrands) {
          brandid = brand.Manufacture_Id;
          let letter = brand.Manufacture_Name.charAt(0);
          if (this.letters[count - 1] != letter) {
            this.letters.push(letter);
            count += 1;
          }
          this.tempBrandId.push(brandid);
        }

        allbrands.map(x => {
          if (!x.Manufacture_CSTNo2 || !this.folder)
            x.Manufacture_CSTNo2 = `https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 `;
          else
            x.Manufacture_CSTNo2 = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${x.Manufacture_CSTNo2}`;
        });
        this.brands = allbrands;
      },
        (_err) => console.error(_err)
      );
  }

  fngetparticularpro(val) {
    this.letters = val;
  }








  fngetAllProducts() {
    let ItemProduct = [];
    let strQuery = "select * from product";
    let objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    this.appService.post("CommonQuery/fnGetDataReportFromQuery", body)
      .subscribe((data) => {
        let result: any = data;
        let jsonproducts = JSON.parse(result.JsonDetails[0]);
        let book;
        for (const product of jsonproducts) {
          let customObj = new Product(
            product.ProductId,
            product.ItemDesc,
            [book],
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
            this.dTempCategoryID,
            product.SpecificationMain_Id,
            product.Manufacture_Id
          );
          ItemProduct.push(customObj);
        }

        this.products = ItemProduct;
        this.tempProducts = this.products;
      });
    this.fngetbranches();
  }
}
