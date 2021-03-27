import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Wishlist } from 'src/app/app.models';
import { AppService, Data } from 'src/app/app.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private dTempAcId: string;
  private Data: Data;
  private folder: string;
  constructor(private appService: AppService,
    private _localStorage: LocalStorageService,
    private router: Router) {
    this.dTempAcId = this._localStorage.getItem('CusEShopId');
    this.appService.assignAcIdId.subscribe(res => {
      this.dTempAcId = res;
    });
    this.appService.getImagePath.subscribe(res => {
      this.folder = res;
    });
    this.Data = appService.Data;
   }

  public addToWishList(product: Wishlist) {
    const BranchId = this._localStorage.getItem('BranchId');
    const PriceMenuId = this._localStorage.getItem('SessionPriceMenuId')
    let ProductId = 0;
    let OrderQty = 1;

    if (this.dTempAcId) {

      ProductId = product.id;
      OrderQty = product.cartCount;

      var ServiceParams = {};
      ServiceParams['strProc'] = 'ProductWishList_Insert';
      ServiceParams['JsonFileName'] = 'JsonScriptTwo';
      var oProcParams = [];

      var ProcParams = {};
      ProcParams['strKey'] = '@ParamsProductId';
      ProcParams['strArgmt'] = ProductId.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsAcId';
      ProcParams['strArgmt'] = String(this.dTempAcId);
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsEnterDate';
      ProcParams['strArgmt'] = '2018-10-10';
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsFlag';
      ProcParams['strArgmt'] = '1';
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = '@ParamsOrderFrom';
      ProcParams['strArgmt'] = 'WishList';
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
      this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
        .subscribe(data => {

        });

      if (this.Data.wishList.filter(item => item.id == product.id)[0]) {
        // message = 'The product ' + product.name + ' already added to wish list.';
        // status = 'success';
      } else {
        this.Data.wishList.push(product);
        // message = 'The product ' + product.name + ' has been added to wish list.';
        // status = 'success';
      }
      this.appService.snackBar.open(`${product.name} is added to My Wishlist`, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    } else {
      this.appService.snackBar.open('Please login or Register !', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      this.router.navigateByUrl('/sign-in');
    }
  }


  fnRemoveAllWish() {
    let AcId = String(this.dTempAcId);

    let strQuery = "delete  from ProductWishList where AcId =" + AcId + " and OrderFrom = 'WishList'";
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(data => {
        this.appService.snackBar.open('Those Products are removed From My Wishlist', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      });
  }

  public fnRemoveWish(product: Wishlist) {

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
    ProcParams['strArgmt'] = 'WishList';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportNew', body)
      .toPromise().then(data => {
        this.appService.snackBar.open(`${product.name} Removed From My Wishlist`, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      });
  }

  public fnGetWishListOnAcId(acId) {
    const BranchId = this._localStorage.getItem('BranchId');
    var ServiceParams = {};
    ServiceParams['strProc'] = 'ProductWishList_GetsOnAcId';
    ServiceParams['JsonFileName'] = 'JsonScriptTwo';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsAcId';
    ProcParams['strArgmt'] = String(acId);
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = '@ParamsOrderFrom';
    ProcParams['strArgmt'] = 'WishList';
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
        const jsonwish = JSON.parse(_data.JsonDetails[0]);
        let objWishitem;

        for (const wish of jsonwish) {
          let image = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360';
          if (wish.ImageLoc && this.folder) {
            image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${wish.ImageLoc}`;
          }

          objWishitem = new Wishlist(
            wish.ProductId,
            wish.ItemDesc,
            [
              {small: image, medium: image, big: image }
            ],
            wish.MRP,
            wish.SelRate,
            wish.Discount,
            wish.AcId,
            wish.OrderQty,
            wish.CategoryCode,
            wish.BalanceQty
          );
          this.Data.wishList.push(objWishitem);
        }
      }, error => console.error(error));


  }

}
