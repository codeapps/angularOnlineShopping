import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ManufactureService {

  constructor(private appService: AppService) { }
  onManufactureGet(branchId:number, cateId:string): Observable<any> {
    let strQuery = '';
    if (branchId == 0) {
      strQuery = `SELECT distinct Manufacture.Manufacture_id, Manufacture.Manufacture_Name from Manufacture inner join Product
                   on Product.Manufacture_Id=Manufacture.Manufacture_Id inner join Category on Product.CategoryCode=category.CategoryID
                   inner join ProductSub on ProductSub.ProductId = Product.ProductId
                   where bOnline  = 1  and category.CategoryID = ${cateId}  order by Manufacture.Manufacture_Name asc`
    } else {
      strQuery = `SELECT distinct Manufacture.Manufacture_id, Manufacture.Manufacture_Name from Manufacture inner join Product
                  on Product.Manufacture_Id=Manufacture.Manufacture_Id inner join Category on Product.CategoryCode=category.CategoryID
                  inner join stock on stock.productid = product.productid
                  inner join ProductSub on ProductSub.ProductId = Product.ProductId
                  where ProductSub.bOnline = 1 and category.CategoryID =${cateId} and stock.BranchId = ${branchId} order by Manufacture.Manufacture_Name asc`

    }

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
   return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }
  onManuFactureGets(): Observable<any> {
    let strQuery = `select * from manufacture order by Manufacture_Name`
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
  }


  public getBrands(sessionWebBranchId):Observable<any> {
    let strQuery = "";

    if (!sessionWebBranchId) {
      strQuery = `select Manufacture_Id, BranchId, Manufacture_Name as name, Manufacture_CSTNo2 as image from  manufacture Where Manufacture_CSTNo2 !=''  order by Manufacture_Name`;
    } else {
      strQuery = `select distinct Manufacture.Manufacture_Id, Manufacture.BranchId, Manufacture_Name as name, Manufacture_CSTNo2 as image from Manufacture
                        inner join Product on Manufacture.Manufacture_Id = Product.Manufacture_Id
                        inner join Stock on Stock.ProductId = Product.ProductId
                        where stock.BranchId = ${sessionWebBranchId} and Manufacture_CSTNo2 !=''
                        order by Manufacture_Name`;
    }

    let objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    return this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)

  }
}
