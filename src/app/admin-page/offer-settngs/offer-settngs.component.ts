import { AppService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-offer-settngs',
  templateUrl: './offer-settngs.component.html',
  styleUrls: ['./offer-settngs.component.scss']
})
export class OfferSettngsComponent implements OnInit {
  FromDate = new Date();
  ToDate = new Date();
  MinDate = new Date();
  MaxDate = new Date();
  sessionWebBranchId: any;
  filterItems: any = 'Product';
  productLists: any = [];
  companyList: any;
  categoryList: any;
  companyId: any;
  categoryId: any;
  description: any = '';
  branchId: any = 0;
  dOfferTypeId: any;
  createFlag: boolean = true
  searchText: any = '';
  offerSettingsList: any;
  searchProducts: any = '';

  colComheader = [{ col: 'Manufacture_Name', width: '230px' }];
  compHeader = ['Company Name'];
  selectComFlag; boolean = false;
  filteredCompany: any = [];
  companyName: any = '';

  categoryName: any = '';
  colCatheader = [{ col: 'CategoryDesc', width: '230px' }];
  catHeader = ['Company Name'];
  selectCatFlag: boolean = false;
  filteredCatgory: any = [];

  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  listShow: boolean = false;
  imageNames: any;
  index: any;

  constructor(public _appService: AppService, private http: Http,private _localStorage: LocalStorageService) { }

  ngOnInit() {
    this.sessionWebBranchId = this._localStorage.getItem("SessionBranchIdWeb");
    this.fnOfferGets();
  }

  fnGetBranchId() {
    let strQuery = `select * from Branch `;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data:any = data
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.branchId = jsonData[0].BranchId;
      this.fngetCompany();
    });
  }

  fngetAllProducts() {
    let strQuery = '';
    strQuery = `select * from Product inner join stock on Product.ProductId = Stock.ProductId
                  left outer join OfferSettings on OfferSettings.ProductId = Product.ProductId
                  left outer join Manufacture on Product.Manufacture_Id = Manufacture.Manufacture_Id
                  left outer join Category on Category.CategoryID = Product.CategoryCode
                  where Stock.BranchId = ${this.branchId} and Product.ItemDesc like` + "'" + this.searchProducts + "%'" + 'order by itemdesc';

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(res => {
      let _data:any= res;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.productLists = jsonData;

    });
  }

  fngetAllProductsWithCompanyId() {
    let strQuery = '';
    strQuery = `select * from Product inner join stock on Product.ProductId = Stock.ProductId
                  left outer join OfferSettings on OfferSettings.ProductId = Product.ProductId
                  left outer join Manufacture on Product.Manufacture_Id = Manufacture.Manufacture_Id
                  left outer join Category on Category.CategoryID = Product.CategoryCode
                  where Stock.BranchId = ${this.branchId} and Product.Manufacture_Id = ${this.companyId}
                   and Product.ItemDesc like`+ "'" + this.searchProducts + "%'" + 'order by itemdesc';

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data:any= data;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.productLists = jsonData;
    });
  }

  fngetAllProductsWithCategoryId() {
    let strQuery = '';
    strQuery = `select * from Product inner join stock on Product.ProductId = Stock.ProductId
                  left outer join OfferSettings on OfferSettings.ProductId = Product.ProductId
                  left outer join Manufacture on Product.Manufacture_Id = Manufacture.Manufacture_Id
                  left outer join Category on Category.CategoryID = Product.CategoryCode
                   where Stock.BranchId = ${this.branchId} and CategoryCode = ${this.categoryId}
                   and Product.ItemDesc like`+ "'" + this.searchProducts + "%'" + 'order by itemdesc';

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data:any= data;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.productLists = jsonData;
    });
  }

  fngetCompany() {
    let strQuery = '';
    strQuery = `select distinct Manufacture.* from Manufacture
                  inner join product on Manufacture.Manufacture_Id = Product.Manufacture_Id
                  inner join Stock on Stock.ProductId = Product.ProductId
                  where Stock.BranchId = ${this.branchId} order by Manufacture_Name`

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data:any= data;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.companyList = jsonData;
      this.fngetCategory();
    });
  }

  fngetCategory() {
    let strQuery = `select distinct Category.* from Category
                  inner join product on Category.CategoryID = Product.CategoryCode
                  inner join Stock on Stock.ProductId = Product.ProductId
                  where Stock.BranchId = ${this.branchId} order by CategoryDesc`;

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data: any = data;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.categoryList = jsonData;
      this.fnSettings();
    });
  }



  fnAssignedToDisplay(eve) {
    let value = eve.target.value;
    for (let index = 0; index < this.productLists.length; index++) {
      this.productLists[index].Offer_DisPers = value;
    }
  }
  fnChangeIndividualDisperc(eve, index) {
    let value = eve.target.value;
    this.productLists[index].Offer_DisPers = value;
  }

  fnSave() {
    if (this.filterItems == 'Company') {
      this.dOfferTypeId = this.companyId;
    } else if (this.filterItems == 'Category') {
      this.dOfferTypeId = this.categoryId;
    } else {
      this.dOfferTypeId = 0;
    }

    if (this.description == '' || this.description == null) {
      alert("Please Enter The Descriptions");
      return;
    }
    var ListOfferSettingsInfo = [];

    for (let i = 0; i < this.productLists.length; i++) {
      if (this.productLists[i].ProductId != 0 && this.productLists[i].Offer_DisPers > 0) {

        let OfferSettingsInfo = {}
        OfferSettingsInfo["ProductId"] = this.productLists[i].ProductId;
        OfferSettingsInfo["FromDate"] = this.FromDate;
        OfferSettingsInfo["ToDate"] = this.ToDate;
        OfferSettingsInfo["Active"] = true;
        OfferSettingsInfo["Description"] = this.description;
        OfferSettingsInfo["Field1"] = this.filterItems;
        OfferSettingsInfo["Field2"] = '';
        OfferSettingsInfo["EnterDate"] = this.MaxDate;
        OfferSettingsInfo["EditDate"] = this.MaxDate;
        OfferSettingsInfo["StaffId"] = 0;
        OfferSettingsInfo["BranchId"] = parseFloat(this.branchId || 0);
        OfferSettingsInfo["Offer_DisPers"] = parseFloat(this.productLists[i].Offer_DisPers || 0);
        OfferSettingsInfo["OfferNo"] = (this.productLists[i].OfferNo == null) ? 0 : this.productLists[i].OfferNo;
        OfferSettingsInfo["OfferBatchNo"] = (this.productLists[i].OfferBatchNo == null) ? 0 : this.productLists[i].OfferBatchNo;
        OfferSettingsInfo["OfferTypeId"] = this.dOfferTypeId;
        OfferSettingsInfo["OfferType"] = this.filterItems;
        ListOfferSettingsInfo.push(OfferSettingsInfo);
      }
    }
    let body = JSON.stringify(ListOfferSettingsInfo);
    this._appService.post('Master/OfferSetting_Insert', body).subscribe(data => {
      let jsonData = data.text();
      alert(jsonData);
      this.fnBack();
    });
  }

  fnClear() {
    this.filterItems = 'Product';
    this.description = '';
    this.productLists = [];
  }

  fnCreate() {
    this.createFlag = false;
  }
  fnBack() {
    this.createFlag = true;
    this.fnClear();
    this.fnOfferGets();
  }

  fnOfferGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "OfferSettings_Gets";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Search";
    ProcParams["strArgmt"] = this.searchText;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData:any= data;
      this.offerSettingsList = jsonData;

      if (this.sessionWebBranchId == 0) {
        this.fnGetBranchId();
      } else {
        this.branchId = this.sessionWebBranchId;
        this.fngetCompany();
      }

    });
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    var ServiceParams = {};
    ServiceParams['strProc'] = "OfferSettings_Get";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "OfferNo";
    ProcParams["strArgmt"] = data.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData:any = data;
      this.filterItems = jsonData[0].Field1;
      this.description = jsonData[0].Description;
      this.FromDate = new Date(jsonData[0].FromDate);
      this.ToDate = new Date(jsonData[0].ToDate);

      if (jsonData[0].OfferType == 'Company') {
        this.companyId = jsonData[0].OfferTypeId;
      } else if (jsonData[0].OfferType == 'Category') {
        this.categoryId = jsonData[0].OfferTypeId;
      }
      this.productLists = jsonData;
    });
  }
  fnSearchProducts() {
    if (this.searchProducts.length > 3) {
      if (this.filterItems == 'Company') {
        this.fngetAllProductsWithCompanyId();
      } else if (this.filterItems == 'Category') {
        this.fngetAllProductsWithCategoryId();
      } else {
        this.fngetAllProducts();
      }
    } else {
      if (this.filterItems == 'Company') {
        this.fngetAllProductsWithCompanyId();
      } else if (this.filterItems == 'Category') {
        this.fngetAllProductsWithCategoryId();
      }
    }
  }

  filterOnCompany(comp) {
    if (!comp) {
      this.selectComFlag = false;
      this.companyId = '';
      return;
    }
    const filterValue = comp.toLowerCase();
    const data = this.companyList.filter(res => res.Manufacture_Name.toLowerCase().indexOf(filterValue) === 0);
    if (data.length > 0) {
      this.selectComFlag = true;
      this.filteredCompany = data;
    } else {
      this.selectComFlag = true;
      this.filteredCompany = [];
    }
  }

  filterOnCategory(cat) {
    if (!cat) {
      this.selectCatFlag = false;
      this.companyId = '';
      return;
    }
    const filterValue = cat.toLowerCase();
    const data = this.categoryList.filter(res => res.CategoryDesc.toLowerCase().indexOf(filterValue) === 0);
    if (data.length > 0) {
      this.selectCatFlag = true;
      this.filteredCatgory = data;
    } else {
      this.selectCatFlag = true;
      this.filteredCatgory = [];
    }
  }
  fnCompanyChange(eve) {
    this.companyId = eve.Manufacture_Id;
    this.companyName = eve.Manufacture_Name;
    this.selectComFlag = false;
    this.fngetAllProductsWithCompanyId();
  }
  fnCategoryChange(eve) {
    this.categoryId = eve.CategoryID;
    this.categoryName = eve.CategoryDesc;
    this.selectCatFlag = false;
    this.fngetAllProductsWithCategoryId();
  }
  fnRadioChange() {
    this.searchProducts = '';
    this.companyName = '';
    this.companyId = '';
    this.categoryId = '';
    this.categoryName = ''
    this.productLists = [];
  }




  fileData: File = null;
  previewUrl: any = null;
  loadingFlag: boolean;
  imageLists = [];
  fnSettings() {
    let strQuery = `select Value from Settings where KeyValue = 'OfferImages'`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data: any = data;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      const DataValues = jsonData[0].Value;
      const Data = DataValues.split(',');
      this.imageLists = Data;
    });
  }

  fnAnchorClickforUploads(Data, ix) {
    this.listShow = true;
    this.imageNames = Data;
    this.index = ix;
    if (this.imageNames == null || this.imageNames == '' || this.imageNames == undefined) {
      this.previewUrl = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360';
    } else {
      this.previewUrl = 'https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this._appService.getImagePath + '/' + this.imageNames;
    }
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }
  fnBackToList() {
    this.fnClearAll();
  }

  fnClearAll() {
    this.fileData = null;
    this.previewUrl = null;
    this.imageNames = '';
    this.listShow = false
    this.fnSettings();
  }

  fnUploadsImages() {
    this.loadingFlag = true;
    this.imageLists[this.index] = 'uploads';
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('Offer1', this.imageLists[0]);
    formData.append('Offer2', this.imageLists[1]);
    formData.append('Offer3', this.imageLists[2]);
    this.http.post(this.baseApiUrl + '/ImageUpload/uploadsOfferImages', formData).subscribe(
      data => {
        this.loadingFlag = false;
        this.fnBackToList();
      });

  }

  fnRemovedOffer(offerno) {
    if (!confirm("Do You Want To Remove Offer From The Lists?..")) {
      return;
    }
    let strQuery = `delete from OfferSettings where OfferNo = ${offerno}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      alert("Removed Successfully");
      this.fnOfferGets();
    });
  }
}
