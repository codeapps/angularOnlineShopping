import { AppService } from 'src/app/app.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { LocalStorageService } from 'src/app/services';
import { Observable } from 'rxjs';
import { AlertModalComponent } from 'src/app/theme/components/alert-modal/alert-modal.component';
@Component({
  selector: 'app-manufacture-branch-edit',
  templateUrl: './manufacture-branch-edit.component.html',
  styleUrls: ['./manufacture-branch-edit.component.scss']
})
export class ManufactureBranchEditComponent implements OnInit {

  saveSelection = new SelectionModel<any>(true, []);
  ManufactureList: any;
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  columnsToDisplay: string[] = ['Manufacture_Id', 'Manufacture_MFRNo', 'Manufacture_Name', 'Manufacture_Addr1'];
  private onlineManufacture: any[] = [];
  productDataSource = new MatTableDataSource<Element>();
  productselection = new SelectionModel<Element>(true, []);
  proColumnToDisplay: string[] = [ 'ProductId', 'bOnline', 'SkuCode', 'ItemDesc', 'CategoryDesc', 'CategoryHead_Name', 'BalanceQty'];

  branchId: any;
  createFlag: boolean = true;
  ManufactureId: any = 0;
  JsonProdGroup: any;
  JsonProdWgt: any;
  webAddress: any;
  signUp: any;
  Login: any;
  productsSubLists: any;
  loadnig: boolean;
  saveloading: boolean;

  constructor(public _appService: AppService, public activatedRoute: ActivatedRoute, public router: Router, public dialog: MatDialog) { }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }



  proisAllSelected() {
    const numSelected = this.productselection.selected.length;
    const numRows = this.productDataSource.data.length;
    if (!numSelected) {
      this.Stockselection.clear();
      this.OnlineSelection.clear();
    }

    return numSelected === numRows;
  }

  promasterToggle() {
    this.proisAllSelected() ?
      this.productselection.clear() :
      this.productDataSource.data.forEach(row => this.productselection.select(row));
  }


  ngOnInit() {
    let val = ''
    let data = this.activatedRoute.params.subscribe(params => {
      this.branchId = params.BranchId;
      this.webAddress = params.WebAddress;
    });

    this.fngetAllMannufactures();
    setTimeout(() => {
      this.fngetGeneralSettings();
    }, 100);
  }

  fngetAllMannufactures() {

    let strQuery = `select * from Manufacture order by Manufacture_Name`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let jsonData: any = data;
      this.ManufactureList = JSON.parse(jsonData.JsonDetails[0]);

      this.dataSource = new MatTableDataSource(this.ManufactureList)
      this.fngetManufactureData();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fngetManufactureData() {
    let strQuery = `
                select distinct Manufacture.* from Manufacture
                inner join Product on Product.Manufacture_Id = Manufacture.Manufacture_Id
                inner join stock on Stock.ProductId = Product.ProductId
                where Stock.BranchId = ${this.branchId}`;

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let jsonData = data;
      let jsonObj = JSON.parse(jsonData.JsonDetails[0]);
      for (const iterator of jsonObj) {
        let selectedbranch = this.ManufactureList.find(x => x.Manufacture_Id == iterator.Manufacture_Id);
        if (selectedbranch)
          this.selection.select(selectedbranch);
      }
      this.fnManufactureIntermediate()
    });
  }

  fnSaveBranches() {
    let ComIds = '';
    var nCount = 0;
    let DataSource: any = this.selection.selected;

    // console.log(DataSource);
    // return
    if (DataSource.length == 0) {
      alert("Please Select Atleast One Brands");
      return;
    }
    let setComIds = '';
    DataSource.forEach((data, index) => {
      if (this.isRowValid(data)) {
        setComIds += `${data.Manufacture_Id},`
        return
      }
      ComIds = ComIds + '\n select ' + data.Manufacture_Id + '  union';
      nCount = nCount + 1;
    });

    if (nCount > 0) {
      ComIds = ComIds.substring(1, ComIds.length - 5);
    }

    if (!ComIds) {
      alert("product only save to specific Item");
     return
    }
    let nonRemove = '';
    let lastStr = setComIds.substring(0, setComIds.length - 1);
    if (lastStr) {
      nonRemove = `and CompanyId not in (${lastStr})`;
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = "CompanyBranchMap_InsertonNewBranch";
    ServiceParams['JsonFileName'] = 'JsonScriptFour';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "@ParamsBranchId";
    ProcParams["strArgmt"] = this.branchId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsComIds";
    ProcParams["strArgmt"] = ComIds;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsNonRemoveCompanyIds";
    ProcParams["strArgmt"] = nonRemove;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      let jsonData: any = data;
      let complaintName = ''
      let value = JSON.parse(jsonData.JsonDetails[0]);
      if (value.length > 0) {
        value.forEach((element, index) => {
          if (index == 0) {
            complaintName += element.Manufacture_Name;
          } else if (index == value.length) {
            complaintName += element.Manufacture_Name;
          } else {
            complaintName += `,${element.Manufacture_Name}`;
          }
        });
        alert(` ${complaintName} -- ${value.length} brands are  Can not be removed because it was purchased...`);
      }
      alert('Saved Successfully');
      window.location.reload();
    });

  }

  fnReset() {
    this.selection.clear();
    this.Stockselection.clear();
    this.productselection.clear();
  }


  fnGetProductWithManufactureId(data) {
    this.createFlag = false;

    this.loadnig = true;
    this.ManufactureId = data.Manufacture_Id
    // let strQuery = `
    // select Product.*,CategoryDesc,CategoryHead.CategoryHead_Name,'0' as BalanceQty,ProductSub.bOnline from Product
    // inner join Category on Category.CategoryID = Product.CategoryCode
    // inner join CategoryHead on CategoryHead.CategoryHead_Id = Category.CategoryHead_Id
    // inner join ProductSub on Product.ProductId = ProductSub.ProductId
    // where Manufacture_Id = ${this.ManufactureId}  order by ItemDesc`;
    let strQuery = `select Product.ProductId,Product.*,CategoryDesc,CategoryHead.CategoryHead_Name,isnull(Stock.BalanceQty,0) BalanceQty from Product
    inner join Category on Category.CategoryID = Product.CategoryCode
    inner join CategoryHead on CategoryHead.CategoryHead_Id = Category.CategoryHead_Id
	left outer join Stock on Product.ProductId = Stock.ProductId and Stock.BranchId = ${this.branchId}
    where Manufacture_Id = ${this.ManufactureId}  order by ItemDesc `;


    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let jsonData: any = data;
      let jsonObj = JSON.parse(jsonData.JsonDetails[0]);

      this.loadnig = false;
      this.productDataSource = new MatTableDataSource(jsonObj);
      this.fngetProductsData(this.ManufactureId);
    });
  }

  fngetProductsData(data) {
    let strQuery = `
    select Product.*,Stock.* from Product
    inner join stock on Product.ProductId = Stock.ProductId
    where Stock.BranchId = ${this.branchId} and Product.Manufacture_Id = ${data}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let jsonData: any = data;
      let jsonObj = JSON.parse(jsonData.JsonDetails[0]);
      this.fnCheckProductStock();
      for (const iterator of jsonObj) {
        let tempproducts:any = this.productDataSource.data;
        let selectedProduct = tempproducts.find(x => x.ProductId == iterator.ProductId);
        if (selectedProduct)
          this.productselection.select(selectedProduct);
      }
    });
  }

  fnProductSubVisible() {

    let strQuery = `select Product.ProductId,Product.ItemDesc,CategoryDesc,CategoryHead.CategoryHead_Name,'0' as BalanceQty,ProductSub.bOnline from Product
    inner join Category on Category.CategoryID = Product.CategoryCode
    inner join CategoryHead on CategoryHead.CategoryHead_Id = Category.CategoryHead_Id
    inner join ProductSub on Product.ProductId = ProductSub.ProductId
    where Manufacture_Id = ${this.ManufactureId} and ProductSub.BranchId = ${this.branchId} and ProductSub.bOnline = 1`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let JonData = JSON.parse(data.JsonDetails[0]);

      for (const iterator of JonData) {
        let tempproducts:any = this.productDataSource.data;
        let selectedProduct = tempproducts.find(x => x.ProductId == iterator.ProductId);
        if (selectedProduct)
          this.OnlineSelection.select(selectedProduct);
      }
    })
  }

  fnManufactureIntermediate() {
    let strQuery = `select Product.ProductId,Product.ItemDesc, Product.Manufacture_Id,ProductSub.bOnline from Product
    inner join Category on Category.CategoryID = Product.CategoryCode
    inner join CategoryHead on CategoryHead.CategoryHead_Id = Category.CategoryHead_Id
    inner join ProductSub on Product.ProductId = ProductSub.ProductId where ProductSub.BranchId = ${this.branchId}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let JonData = JSON.parse(data.JsonDetails[0]);
      this.onlineManufacture = JonData;

     });
  }


  isRowValid(row) {

    let items:any[] = this.onlineManufacture.filter(x => x.Manufacture_Id == row.Manufacture_Id);
    let manFacLength = items.length;
    let bOnlineLength = items.filter(y => y.bOnline).length;
    if (manFacLength == bOnlineLength)
      return true;
    else return false;
  }

  fnCheckProductStock() {
    let strQuery = `
    select Product.* from Product
    inner join stock on Product.ProductId = Stock.ProductId
    where Stock.BranchId = ${this.branchId} and Product.Manufacture_Id = ${this.ManufactureId}` + ' and stock.BalanceQty > 0';
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      this.fnProductWgtRefresh();
      let jsonData: any = data;
      let jsonObj = JSON.parse(jsonData.JsonDetails[0]);
      this.fnProductSubVisible();
      for (const iterator of jsonObj) {
        let tempproducts:any = this.productDataSource.data;
        let selectedProduct = tempproducts.find(x => x.ProductId == iterator.ProductId);
        if (selectedProduct)
          this.Stockselection.select(selectedProduct);
      }
    });
  }

  fnSearchFilterOnProducts(filterValue) {
    this.productDataSource.filter = filterValue.trim().toLowerCase();

  }

  fnBackToManu() {
    this.createFlag = true;
    this.productDataSource.filteredData = [];
    this.productselection.clear();
    this.Stockselection.clear();
    this.ManufactureId = 0;
    this.fngetAllMannufactures();
  }

  OnlineSelection = new SelectionModel<Element>(true, []);
  ProOnlineisAllSelected() {
    const numSelected = this.OnlineSelection.selected.length;
    const numRows = this.productDataSource.data.length;
    return numSelected === numRows;
  }

  ProOnlinemasterToggle() {
    this.ProOnlineisAllSelected() ?
      this.OnlineSelection.clear() :
      this.productDataSource.data.forEach(row => this.OnlineSelection.select(row));
  }



  Stockselection = new SelectionModel<Element>(true, []);
  StockisAllSelected() {
    const numSelected = this.Stockselection.selected.length;
    const numRows = this.productDataSource.data.length;
    return numSelected === numRows;
  }

  StockmasterToggle() {
    this.StockisAllSelected() ?
      this.Stockselection.clear() :
      this.productDataSource.data.forEach(row => this.Stockselection.select(row));
  }


  fnSaveProducts() {
    let ComIds = '';
    let stock: any = '';
    var nCount = 0;
    let sortId: any = ''
    let item: any = '';
    let onlineIds: any = '';
    let term1: any = '';
    let DataSource: any = this.productselection.selected;
    let stockDataSource: any = this.Stockselection.selected;
    let bOnlineSource: any = this.OnlineSelection.selected
    if (DataSource.length == 0)
      if(!confirm("No products are selected Do you want continue?"))
      return;

    DataSource.forEach((data, index) => {
      ComIds = ComIds + '\n select ' + data.ProductId + '  union';
      nCount = nCount + 1;
    });
    if (nCount > 0) {
      ComIds = ComIds.substring(1, ComIds.length - 5);
    }

    if (stockDataSource.length > 0) {
      stockDataSource.forEach((data, index) => {
        if (index == 0) {
          stock = ` and ( Stock.ProductId = ${data.ProductId}`;
        } else {
          stock += ` or Stock.ProductId  = ${data.ProductId}`;
        }

      });
      stock += ' )';
    }

    stockDataSource.forEach((element, index) => {
      if (index == 0) {
        item += element.ProductId;
      } else if (index == stockDataSource.length) {
        item += element.ProductId;
      } else {
        item += `,${element.ProductId}`;
      }
    });
    sortId = item;

    console.log(stock);
    console.log(sortId);

    bOnlineSource.forEach((element, index) => {
      if (index == 0) {
        term1 += element.ProductId;
      } else if (index == bOnlineSource.length) {
        term1 += element.ProductId;
      } else {
        term1 += `,${element.ProductId}`;
      }
    });
    onlineIds = term1;

    let ServiceParams = {};
    ServiceParams['strProc'] = "ProductBranchMap_InsertonNewBranch";
    ServiceParams['JsonFileName'] = 'JsonScriptFour';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "@ParamsBranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsProductIds"; // product visible
    ProcParams["strArgmt"] = ComIds;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsstockProductIds"; // cart visible
    ProcParams["strArgmt"] = stock;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsManufactureId";
    ProcParams["strArgmt"] = this.ManufactureId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsNotStockProdIds"; // cart visible
    ProcParams["strArgmt"] = sortId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsbeOnlineds"; // product online visible
    ProcParams["strArgmt"] = onlineIds;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this.saveloading = true;
    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
      .subscribe(data => {
      let _data: any = data;
      let jsonData = JSON.parse(_data.JsonDetails[0])
      let complaintName = '';
      this.saveloading = false;
      if(jsonData.length>0) {
        jsonData.forEach((element, index) => {
          if (index == 0) {
            complaintName += element.ItemDesc;
          } else if (index == jsonData.length) {
            complaintName += element.ItemDesc;
          } else {
            complaintName += `,${element.ItemDesc}`;
          }
        });
        this.onAlertDialogue(`${jsonData.length} products Can't be remove because it was purchased`, `${complaintName}`)
      } else {
          this.checkReload();
      }

    });
  }

  onAlertDialogue(title:string, msg:string) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      // width: '250px',
      data: { header: title, message: msg },
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.checkReload();
    });
  }

  onReloadAlert() {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      // width: '250px',
      data: { header: `Do you wan't reload this page!!`, message: 'All the changes are required page loading.' },
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) window.location.reload();
    });
  }

  checkReload() {
    let DataSource: any = this.saveSelection.selected;
    if (DataSource.length == 0) {
      this.onReloadAlert();
      return;
    }
    this.fnSaveChanges()
  }

  fnProductWgtRefresh() {

    let strQuery = `select CategoryHead.CategoryHead_Name,ProductGroupId,Manufacture_Id  from CompanyProductGroupLink inner join CategoryHead on
                    CompanyProductGroupLink.ProductGroupId = CategoryHead.CategoryHead_Id
                    where CategoryHead.CategoryHeadType = 15
                    order by CategoryHead_Name`

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(res => {
        let data: any = res;
        this.JsonProdGroup = JSON.parse(data.JsonDetails[0]);
      }).finally(() => {
        this.fnProdWeightType();
      }).catch((err) => console.error(err));
  }

  fnProdWeightType() {

    let varArguements = { Id: '16' };
    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'CategoryHead_GetOnTypeId';


    let body = JSON.stringify(DictionaryObject);
    this._appService.post('Master/CategoryHeadGetsOnTypeId', body)
      .toPromise().then(data => {
        this.JsonProdWgt = data;
      });
  }

  fnSaveChanges() {
    let DataSource: any = this.saveSelection.selected;

    let ListProductInfo = [];
    for (const iterator of DataSource) {
      let ProductInfo = {}
      ProductInfo['ItemCode'] = iterator.ItemCode;
      ProductInfo['ItemDesc'] = iterator.ItemDesc;
      ProductInfo['CategoryCode'] = parseFloat(iterator.CategoryCode || 0);
      ProductInfo['PackType'] = String(iterator.PackType);
      ProductInfo['Manufacture_Id'] = parseFloat(iterator.Manufacture_Id || 0);
      ProductInfo['TaxGroupId'] = parseFloat(iterator.TaxGroupId || 0);
      ProductInfo['ProductId'] = parseFloat(iterator.ProductId || 0);
      ProductInfo['SkuCode'] = iterator.HSNCode;
      ProductInfo['Hsn_Id'] = parseFloat(iterator.HsnId || 0);
      ProductInfo['Location'] = iterator.ProdLocation;
      ProductInfo['GroupId'] = parseFloat(iterator.DrugScheduleId || 0);
      ProductInfo['ChemicalId'] = parseFloat(iterator.ChemicalId || 0);
      ProductInfo['BranchId'] = parseFloat(this.branchId);
      ProductInfo['SelRate'] = parseFloat(iterator.SelRate || 0);
      ProductInfo['MRP'] = parseFloat(iterator.MRP || 0);
      ProductInfo['SpRate1'] = parseFloat(iterator.SpRate1 || 0);
      ProductInfo['SpRate2'] = parseFloat(iterator.SpRate2 || 0);
      ProductInfo['ProdSpRate3'] = parseFloat(iterator.SpRate3 || 0);
      ProductInfo['ProdSpRate4'] = parseFloat(iterator.SpRate4 || 0);
      ProductInfo['ProdSpRate5'] = parseFloat(iterator.SpRate5 || 0);
      ProductInfo['WholeSaleRate'] = parseFloat(iterator.WholeSaleRate || 0);
      ProductInfo['ProdMapId'] = parseFloat(iterator.ProdMapId || 0);
      ProductInfo['ImageLoc'] = iterator.ImageLoc;
      ProductInfo['ProductGrpId'] = parseFloat(iterator.ProductGrpId || 0);
      ProductInfo['ProdWgtTypeId'] = parseFloat(iterator.ProdWgtTypeId || 0);
      ProductInfo['ProdWeight'] = parseFloat(iterator.ProdWeight || 0);
      ProductInfo['RewardPts'] = parseFloat(iterator.RewardPts || 0);
      ProductInfo['Model'] = iterator.Model;
      ProductInfo['VendorCode'] = iterator.VendorCode;
      ProductInfo['ProductLinkId'] = parseFloat(iterator.MasterProductId || 0);
      // ProductInfoObj['ImageLoc'] = iterator.ImageLoc;
      ListProductInfo.push(ProductInfo);
    }
    let body = JSON.stringify(ListProductInfo);
    this._appService.post('Master/fnUpdateProductCorrection', body)
      .subscribe(res => {
        this.onReloadAlert();
      }, err => console.error(err));

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(groupDialog,
      {
        width: '850px',
        hasBackdrop: true,
        data: this.ManufactureId,
        disableClose: false
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.fnProductWgtRefresh();
    });
  }

  fngetGeneralSettings() {
    this._appService.onOrderWebAddressBranch()
    .subscribe(res => {
      let jsonData = JSON.parse(res.JsonDetails[0]);
      let jsonWeb = this._appService.onFindUrlValidate(jsonData);
      if (jsonWeb) {
        this.Login = jsonWeb.LoginVisible;
        this.signUp = jsonWeb.SignUpVisible;
      }

    });


  }

  fnUpdateGeneralSettings() {
    let StrQuery = `update OrderWebAddressBranch set SignUpVisible = '${this.signUp}', LoginVisible = '${this.Login}'  where WebAddress = '${this.webAddress}'
                    select 'update successfully' flag`
    var objDictionary = { strQuery: StrQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      alert("Updated Successfully");
      this.fngetGeneralSettings();
    })
  }
}


@Component({
  selector: 'groupDialog',
  templateUrl: 'productpop.html',
  styleUrls: ['./manufacture-branch-edit.component.scss']
})
export class groupDialog {
  categoryName: any;
  ddlManufacture: any;
  manufactureSource: any = [];
  txtCategoryHeadOrderNo: any = '0';
  txtDisplayName: any = '';
  txtRemarks: any = '';
  branchId;
  groupId: any = 15;
  constructor(public dialogRef: MatDialogRef<groupDialog>, @Inject(MAT_DIALOG_DATA) public data,
    public appService: AppService, private _localStorage: LocalStorageService) { }

  ngOnInit() {
    this.branchId = this._localStorage.getItem("SessionBranchIdWeb");
    this.ddlManufacture = this.data;
    this.fnManufactureGets();
  }
  fnManufactureGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "Manufacture_GetsForReportJson";
    ServiceParams['JsonFileName'] = 'JsonScriptThree';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "@ParamsManufacture_Name";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsBranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
      .subscribe(data => {
        let jsonData: any = data;
        this.manufactureSource = JSON.parse(jsonData.JsonDetails[0]);
      })
  }

  fnInsert() {
    if (this.groupId == '15' && !this.ddlManufacture) {
      alert("Select Manufacture");
      return;
    }
    if (this.categoryName == '') {
      alert("Enter Categroy Head Name");
      return;
    }

    let areaid = 0;

    let varArguements = {
      CategoryHeadName: this.categoryName, CategoryHeadType: this.groupId,
      ProductType_Id: 0, CategoryHead_OrderNo: this.txtCategoryHeadOrderNo,
      CategoryHead_DisplayName: this.txtDisplayName, CategoryHead_Remarks: this.txtRemarks
    };

    let DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'CategoryHead_InsertDetails';
    let body = JSON.stringify(DictionaryObject);
    this.appService.post('Master/CategoryHead_Insert', DictionaryObject)
      .subscribe(res => {
        let data: any = res.text();
        if (data == "Already Exists") {
          alert(data);
          return;
        }
        let dTempCategoryHeadId = parseFloat(data || 0);
        if (this.groupId == '15') {
          this.fnManufactureWgtCategoryInsert(dTempCategoryHeadId);
        }
      })
  }

  fnManufactureWgtCategoryInsert(val) {
    let dManufactureId = this.ddlManufacture;

    let ServiceParams = {};
    ServiceParams['strProc'] = "CompanyProductGrpInsert";
    ServiceParams['JsonFileName'] = 'JsonScriptThree';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams["strKey"] = "@ParamsProductGroupId";
    ProcParams["strArgmt"] = val.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsManufacture_Id";
    ProcParams["strArgmt"] = String(dManufactureId);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', ServiceParams)
      .subscribe(res => {
        let data: any = res;
        // let jsonobj = JSON.parse(data.JsonDetails[0]);
        this.fnClose();
      })
  }

  fnClose() {
    this.dialogRef.close();
  }
}
