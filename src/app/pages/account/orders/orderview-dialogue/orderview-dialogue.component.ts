import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { CartItem } from 'src/app/app.models';
import { AccountsService, CartService, LocalStorageService } from 'src/app/services';


@Component({
  selector: 'app-orderview-dialogue',
  templateUrl: './orderview-dialogue.component.html',
  styleUrls: ['./orderview-dialogue.component.scss']
})
export class OrderviewDialogueComponent implements OnInit {
  orders: any[] = [];

  ordermainId: any;
  orderdate: any;

  ordersubuniq: any;
  addProductbtn: boolean;
  AcId: any;
  productItems: any;
  DataSource: any = [];
  imgFolder: string;

  constructor(public dialogRef: MatDialogRef<OrderviewDialogueComponent>, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public order: any,
    public appService: AppService, private accountService: AccountsService,
    private cartService: CartService,
   private _localStorage: LocalStorageService,) { }

  ngOnInit() {
    this.DataSource = this.order;
    this.appService.getImagePath.subscribe(res => {
      if (res) {
        this.imgFolder = res;
        this.onOrdetView();
      }

    });



  }
  onOrdetView() {
    this.accountService.onOrderDetailsGetonAcid(this.DataSource.OrderMain_Id)
    .toPromise().then(data => {
      this.orders = data;

    this.ordermainId = this.orders[0].OrderMain_Id
    this.ordersubuniq = this.orders[0].UniqueId
    this.orderdate = this.orders[0].OrderMain_Date
    this.orders.map(data => data.ImageLoc = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imgFolder}/${data.ImageLoc}`)

    let ordermainId = this._localStorage.getItem("sessionOrderMainId");
    let uniqueId = this._localStorage.getItem("sessionUniqueId");
    this.AcId = this._localStorage.getItem("CusEShopId")


    if (ordermainId == null && uniqueId == null) {
      this.addProductbtn = true;
    } else {
      this.addProductbtn = false;
    }
  });
}
  onNoClick(): void {
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }

  addProducts() {
    let product: any = [];
    this._localStorage.setItem("sessionOrderMainId", this.ordermainId);
    this._localStorage.setItem("sessionUniqueId", this.ordersubuniq);
    this.addProductbtn = false;

    let strQuery = `select * from EShopOrderMain inner join EShopOrderDetails on EShopOrderMain.OrderMain_Id = EShopOrderDetails.OrderMain_Id
                    inner join Product on Product.ProductId = EShopOrderDetails.ProductId
			            	where EShopOrderMain.OrderMain_Id = ${this.ordermainId}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .subscribe(data => {
        product = JSON.parse(data.JsonDetails[0]);

      for (var i = 0; i < product.length; i++) {

        let cartitemobj = new CartItem(
          product[i].ProductId,
          product[i].ItemDesc,
          [{ 'small': 'https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this.imgFolder + '/' + product[i].ImageLoc }],
          product[i].MRP,
          product[i].OrderSub_SelRate,
          product[i].Discount,
          this.AcId,
          parseFloat(product[i].OrderSub_Qty || 0),
          product[i].CategoryCode,
          parseFloat(product[i].TotQty || 0),
        );
        // this.appService.Data.cartList.push(cartitemobj)
        this.cartService.addToCart(cartitemobj);
      }
      // this.appService.Data.cartList.forEach(CartItem => {
      //   this.appService.Data.totalPrice = this.appService.Data.totalPrice + (CartItem.cartCount * CartItem.newPrice);
      //   this.appService.Data.totalCartCount = this.appService.Data.cartList.length;
      // });
      this.onNoClick();
    })

  }

  fnReset() {
    this.addProductbtn = true;
    this._localStorage.removeItem("sessionOrderMainId");
    this._localStorage.removeItem("sessionUniqueId");
  }
  fnSplitWhiteSpace(date) {
    if (date == undefined || date == null || date == "") {
      return;
    }
    let a = date.split('T');
    let b = a[0];
    let c = b.split('-').reverse().join('/');
    return c;
  }
}
