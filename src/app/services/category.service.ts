import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private appService: AppService) { }

  ongetProductTypewithBranchId(val):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ProductTypeandCategoriesGetsWithBranchId';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = val.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsProductSpecification';
    ProcParams['strArgmt'] = "1";
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFileDiff', body)
  }

  onGetAllCategory(branchId, acId):Observable<any> {
    let strQuery = '';
    strQuery = `select  distinct Category.CategoryID ,Category.* from Category
                        inner join Product on Product.CategoryCode = Category.CategoryID
                        inner join ProductWishList on ProductWishList.ProductId = Product.ProductId
                        where ProductWishList.OrderFrom = 'WishList'  and ProductWishList.BranchId = ${branchId}  and ProductWishList.AcId = ${acId}`;

    let objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }

  onGetAllCategoriesInAcId(acid):Observable<any> {
  let strQuery = '';
  strQuery = `select distinct Category.CategoryID,Category.* from Category
                                  inner join Product on Product.CategoryCode = Category.CategoryID
                                  inner join IssueSubDetails on IssueSubDetails.ProductId = Product.ProductId
                                  inner join issue on IssueSubDetails.Issue_SlNo = issue.Issue_SlNo and IssueSubDetails.UniqueBillNo = issue.UniqueBillNo
                                  where IssueSubDetails.BranchId = 17 and issue.AcId = ${acid}`;

  var objDictionary = { strQuery: strQuery };
  let body = JSON.stringify(objDictionary);
   return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }

  getCategoryHead(sessBranchId): Observable<any> {
    let strQuery = `select distinct CategoryHead.* from CategoryHead
    inner join Category on Category.CategoryHead_Id = CategoryHead.CategoryHead_Id
    inner join Product on Product.CategoryCode = Category.CategoryID
    inner join stock on Stock.ProductId = Product.ProductId
    where CategoryHeadType = 1 and Stock.BranchId = ${sessBranchId}`;

    if (!sessBranchId) {
      strQuery = 'select * from CategoryHead where CategoryHeadType = 1';
    }
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }

  onProductTypeIdInCategory(id): Observable<any> {
    let categoryId = parseFloat(id);
    let strQuery = `select * from Category where CategoryID = ${categoryId}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }
}
