import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private appService: AppService) { }

  onProductGets(catId: string, headId: string, typeId: string, sort: string, mainId: string,
    priceFrom: string, priceTo: string, priceId: string, brandId: string, branchId: string): Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ProductListForShoppingCart';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsCategoryId';
    ProcParams['strArgmt'] = catId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsCategoryHeadId';
    ProcParams['strArgmt'] = headId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsProductTypeId';
    ProcParams['strArgmt'] = typeId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsSortBy';
    ProcParams['strArgmt'] = sort;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsSpecificationIds';
    ProcParams['strArgmt'] = mainId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsMinValue';
    ProcParams['strArgmt'] = priceFrom.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = '@ParamsMaxValue';
    ProcParams['strArgmt'] = priceTo.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsPriceMenuId';
    ProcParams['strArgmt'] = priceId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsComIds';
    ProcParams['strArgmt'] = brandId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = branchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFileDiff', body)
  }


  onProductsSearch(keyword: string, branchId: number): Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'SearchAllListMainHeader';

    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsSearchValue';
    ProcParams['strArgmt'] = keyword;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = branchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
  }

  onProductGetOnManufactureId(Id): Observable<any> {
    let strQuery = `select ProductId, ItemDesc, CategoryCode, ImageLoc,Manufacture_Name,CategoryDesc as CategoryName from Product
    inner join Manufacture on Product.Manufacture_Id = Manufacture.Manufacture_Id
    inner join Category on Product.CategoryCode = Category.CategoryID where Product.Manufacture_Id = ${Id}
    order by ItemDesc asc`
    let objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }

  fnSubImageGetOnProductId(productId: string): Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = "ProductSubImageGetOnProductId";
    ServiceParams['JsonFileName'] = 'JsonScriptTwo';

    let  oProcParams = [];

    let  ProcParams = {};
    ProcParams["strKey"]   = "@ParamsProductId";
    ProcParams["strArgmt"] = String(productId);
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
  }

  onSubImageRemove(uniqueId) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ProductSubImageRemove';

    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsUniqueKey';
    ProcParams['strArgmt'] = String(uniqueId);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
  }

  onRelativeProducts(productId:string, priceId:string) {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'Product_RelatedItemOnSpecification';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'ProductId';
    ProcParams['strArgmt'] = productId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Search';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'FromRecord';
    ProcParams['strArgmt'] = "1";
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToRecord';
    ProcParams['strArgmt'] = "20";
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'NoOfRecord';
    ProcParams['strArgmt'] = "20";
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'PriceMenuId';
    ProcParams['strArgmt'] = priceId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportNew', body)
  }

  onProductById(id, branchId) {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'productgetById';
    ServiceParams['JsonFileName'] = 'JsonScriptOne';

    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsProductId';
    ProcParams['strArgmt'] = id.toString();
    oProcParams.push(ProcParams);

    var ProcParams = {};
    ProcParams['strKey'] = ' @ParamsBranchId';
    ProcParams['strArgmt'] = branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body);
  }


  onFeaturedProducts(branchId): Observable<any> {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'getFeatureProduct';
    ServiceParams['JsonFileName'] = 'JsonScriptTwo';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = String(branchId);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
   return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFilesforBanner', body)
  }


  onTopSellingProducts(branchId): Observable<any> {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'getTopSellingProducts';
    ServiceParams['JsonFileName'] = 'JsonScriptTwo';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = String(branchId);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFilesforBanner', body)
  }

}
