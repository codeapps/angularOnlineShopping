import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from 'src/app/app.models';
import { AppService, Data } from 'src/app/app.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { WishlistService } from './wishlist.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private dTempAcId: string;
  private cartSubject$ = new BehaviorSubject<any[]>([]);
  private Data: Data;
  folder: string = '';
  constructor(private appService: AppService,
    private _localStorage: LocalStorageService,
    private router: Router, private wishlistService: WishlistService) {
    this.dTempAcId = this._localStorage.getItem('CusEShopId');
    this.appService.assignAcIdId.subscribe(res => {
      this.dTempAcId = res;
    });
    this.appService.getImagePath.subscribe(res => {
      this.folder = res;
    });
    this.Data = appService.Data;
  }

  updateCart(value) {
    this.cartSubject$.next(value)
  }

  public get subjcartItems(): Observable<any[]> {
    return this.cartSubject$
  }

  fnRemoveAllCart() {
    let AcId = this.dTempAcId;

    let strQuery = "delete  from ProductWishList where AcId =" + AcId + " and OrderFrom = 'CartList'";
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(data => {
        this.appService.snackBar.open('Those Products are removed', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      });
  }


  public fnRemoveCart(product: CartItem) {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'ProductWishList_DeleteOnAcIdProductId';

    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'AcId';
    ProcParams['strArgmt'] = String(this.dTempAcId);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ProductId';
    ProcParams['strArgmt'] = product.id.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'OrderFrom';
    ProcParams['strArgmt'] = 'CartList';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportNew', body)
      .toPromise().then(data => {
        this.appService.snackBar.open('This Product ' + product.name + 'has been removed', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

      });
  }

  public fnGetCartListOnAcId(acId) {

    const BranchId = this._localStorage.getItem('BranchId');

    let ServiceParams = {};
    ServiceParams['strProc'] = 'getCartItems';
    ServiceParams['JsonFileName'] = 'JsonScriptTwo';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsAccountId';
    ProcParams['strArgmt'] = String(acId);
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = '@ParamsOrderFrom';
    ProcParams['strArgmt'] = "'CartList'";
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = BranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFileForService', body)
      .toPromise().then(data => {
        let _data: any = data;
        let jsoncart = JSON.parse(_data.JsonDetails[0]);

        let objCartitem;
        for (const cart of jsoncart) {
          let image = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360';
          if (cart.ImageLoc && this.folder) {
            image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${cart.ImageLoc}`;
          }
          objCartitem = new CartItem(
            cart.ProductId,
            cart.ItemDesc,
            [
              {small: image, medium: image, big: image }
            ],
            cart.MRP,
            cart.SelRate,
            cart.Discount,
            cart.AcId,
            cart.OrderQty,
            0,
            cart.BalanceQty
          );
          this.Data.cartList.push(objCartitem);

        }
        this.updateCart(this.Data.cartList)
        this.Data.totalPrice = null;
        this.Data.totalCartCount = null;


        this.Data.cartList.forEach(CartItem => {
          this.Data.totalPrice = this.Data.totalPrice + (CartItem.cartCount * (CartItem.newPrice - (CartItem.newPrice * CartItem.discount) / 100));
          // this.Data.totalCartCount = this.Data.totalCartCount + CartItem.cartCount;
        });
        this.Data.totalCartCount = jsoncart.length;
      }).finally(() => {
        this.wishlistService.fnGetWishListOnAcId(acId);
      });
  }


  public addToCart(product: CartItem) {

    const BranchId = this._localStorage.getItem('BranchId');
    let PriceMenuId = this._localStorage.getItem('SessionPriceMenuId');
    if (PriceMenuId == null || PriceMenuId == undefined)
      PriceMenuId = "0";
    let ProductId = 0;
    let OrderQty = 1;
    let message, status;
    if (this.dTempAcId) {

      ProductId = product.id;
      OrderQty = product.cartCount;

      var ServiceParams = {};
      ServiceParams['strProc'] = 'ProductWishList_Insert';
      ServiceParams['JsonFileName'] = 'JsonScriptTwo';
      let oProcParams = [];

      let ProcParams = {};
      ProcParams['strKey'] = '@ParamsProductId';
      ProcParams['strArgmt'] = ProductId.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsAcId';
      ProcParams['strArgmt'] = this.dTempAcId.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsEnterDate';
      ProcParams['strArgmt'] = '2018-10-10';
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsFlag';
      ProcParams['strArgmt'] = "1";
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsOrderFrom';
      ProcParams['strArgmt'] = 'CartList';
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsOrderQty';
      ProcParams['strArgmt'] = OrderQty.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsBranchId';
      ProcParams['strArgmt'] = BranchId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsPriceMenuId';
      ProcParams['strArgmt'] = PriceMenuId.toString();
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;

      let body = JSON.stringify(ServiceParams);
      this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFileForService', body)
        .subscribe(data => {

        });

      this.Data.totalPrice = null;
      this.Data.totalCartCount = null;

      if (this.Data.cartList.filter(item => item.id == product.id)[0]) {
        let item = this.Data.cartList.filter(item => item.id == product.id)[0];
        item.cartCount = product.cartCount;
      } else {
        this.Data.cartList.push(product);
      }
      this.updateCart(this.Data.cartList)
      this.Data.cartList.forEach(CartItem => {

        this.Data.totalPrice = this.Data.totalPrice + (CartItem.cartCount * (CartItem.newPrice - (CartItem.newPrice * CartItem.discount) / 100));
        //  this.Data.totalCartCount = this.Data.totalCartCount + CartItem.cartCount;
        this.Data.totalCartCount = this.Data.cartList.length;
      });

      message = 'The product ' + product.name + ' has been added to cart.';
      status = 'success';
      this.appService.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });

    } else {
      this.appService.snackBar.open('Please login or Register !', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      this.router.navigateByUrl('/sign-in');
    }
  }

}
