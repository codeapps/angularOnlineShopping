import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {

  constructor(private appService: AppService) { }

   onSpecificationGetsOnCategoryId(categoryId: string): Observable<any> {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'GetSpecificationsHeader';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsCategoryId';
    ProcParams['strArgmt'] = categoryId;
    oProcParams.push(ProcParams);


    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
   return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
   }

  onSpecificationSub(categoryId: string, specificationId: string): Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'GetSpecifications';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsCategoryid';
    ProcParams['strArgmt'] = categoryId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsSpecificationId';
    ProcParams['strArgmt'] = specificationId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
  }

  onSpecificationHeadGetOnBrandId(brandIds): Observable<any> {
    let StrQuery = `select *  from SpecificationHead  where  SpecificationHead_Id in
    (select SpecificationHead_Id from SpecificationMain where SpecificationMain_Id in (
    select SpecificationSub.SpecificationMain_Id from ProductSpecificationLink inner join Product on ProductSpecificationLink.ProductId = Product.ProductId
    inner join SpecificationSub on SpecificationSub.SpecificationSubId = ProductSpecificationLink.SpecificationSubId
    where Manufacture_Id =${brandIds}))`

      var objDictionary = { strQuery: StrQuery };
      let body = JSON.stringify(objDictionary);
      return  this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }

  onSpecificationSubOnBrandId(specificationId, brandId): Observable<any> {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'GetSpecificationsHeaderBrands';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsManufactureId';
    ProcParams['strArgmt'] = brandId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsSpecificationId';
    ProcParams['strArgmt'] = specificationId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
  }

  onSpecificationByProdId(productId, branchId): Observable<any> {
    let ServiceParams ={};
    ServiceParams["strProc"] = 'Product_GetNew';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'ProductId';
    ProcParams['strArgmt'] = productId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    return this.appService.post('CommonQuery/fnGetDataReportNew', body)
  }
}
