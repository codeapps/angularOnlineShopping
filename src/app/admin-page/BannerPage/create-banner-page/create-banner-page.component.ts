import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';

import { AppService } from '../../../app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonRendererComponent } from '../button-renderer.component';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services';
import { MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-banner-page',
  templateUrl: './create-banner-page.component.html',
  styleUrls: ['./create-banner-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class CreateBannerPageComponent implements OnInit {
  fileData: File = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  mobileImg: any[] = [];
  siteImg: any[] = [];
  dataList: any = [];
  listShow: boolean = false;
  categoryName: string = '';
  txtCategoryId = 0;
  txtCategoryHeadOrderNo: string;
  txtDisplayName: any;
  txtRemarks: any;
  categoryShow: boolean;
  tempDataList: any;
  groupId: string = '15';
  prodTypeId: any = '0';

  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  editable: boolean;

  frameworkComponents: any;
  categoryHeadName: any;

  imageOptions: any = 'site'
  categoryId: any;

  public rowSelection;
  loadingFlag: boolean;
  manufactureSource: any;
  branchId: any;
  ddlManufacture: any;
  productType: any;
  folderName = '';
  constructor(private http: Http,private httpClient: HttpClient, private appService: AppService, private _snackBar: MatSnackBar,
     private _localStorage: LocalStorageService) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
    this.rowSelection = 'single';
    this.branchId = this._localStorage.getItem("SessionBranchIdWeb");
  }

  displayedColumns: string[] = ['CategoryHead_Name', 'CategoryHead_ImageLoc', 'CategoryHead_DisplayName' , 'edit'];
  categorySource = new MatTableDataSource<any[]>([]);

  ngOnInit(): void {
    this.editable = false;
    this.fngetCategoryHead();
    this.GetCategory();
    this.appService.getImagePath.subscribe(res => {
      this.folderName = res
    });
  }




  fngetCategoryHead() {
    let strQuery = 'select * from CategoryHead  where CategoryHeadType = 1 order by CategoryHead_Name';
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {
        var result:any = data;
        const categoryHead = JSON.parse(result.JsonDetails[0]);
        this.categorySource = new MatTableDataSource(categoryHead)
      }, error => (console.error(error)));

  }

  applyCategoryFilter(filterValue: string) {
    this.categorySource.filter = filterValue.trim().toLowerCase();
  }
  mobileImgName = '';
  siteImgName = '';
  onAnchorClick(item) {
    this.editable = true;

    this.categoryId = item.CategoryHead_Id;
    this.categoryHeadName = item.CategoryHead_Name;

    let mobileImg = item.CategoryHead_DisplayName;
    let siteImg = item.CategoryHead_ImageLoc;
    this.mobileImgName = mobileImg;
    this.siteImgName = siteImg;

      if (!siteImg) {
        this.siteImg = [{ preview: 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360' }];
      } else {
        this.siteImg = [{ preview: 'https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this.folderName + '/' + siteImg}];
      }

      if (!mobileImg) {
        this.mobileImg = [{ preview: 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360' }];
      } else {
        this.mobileImg = [{ preview: 'https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this.folderName + '/' + mobileImg }];
      }


  }

  fnBack() {
    this.editable = false;
    this.fnClear();
    this.fngetCategoryHead();
  }


  // Update() {
  //   this.loadingFlag = true;
  //   let BranchId: any = 17;
  //   var fileFullPath = "";
  //   const formData = new FormData();
  //   formData.append('file', this.fileData);
  //   formData.append("ImageName", this.imageName);
  //   formData.append("BranchId", BranchId);
  //   formData.append("Id", this.categoryId);
  //   formData.append("fileFullPath", fileFullPath);
  //   formData.append("categoryHeadName", this.categoryHeadName);
  //   this.http.post(this.baseApiUrl + '/ImageUpload/UploadImageforcategoryHead', formData).subscribe(
  //     data => {
  //       this._snackBar.open('Update Successfully....!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
  //       this.loadingFlag = false;
  //       this.fnBack();
  //     });
  // }

  fnClear() {
    this.categoryId = '';
    this.categoryHeadName = '';
    this.fileData = null;
    this.siteImg = [];
    this.mobileImg = [];
    this.imageOptions = 'site';
  }


  fnSave() {

    let siteFile:string = '';
    let mobileFile:string = '';
    if (this.siteImg.length && this.siteImg[0].file) {
      siteFile = this.siteImg[0].file;
    } else if (this.siteImg.length && this.siteImg[0].preview) {
      siteFile = this.siteImgName;

    }

    if (this.mobileImg.length && this.mobileImg[0].file) {
      mobileFile = this.mobileImg[0].file;
    } else if (this.mobileImg.length && this.mobileImg[0].preview) {
      mobileFile = this.mobileImgName;
    }

    this.loadingFlag = true;
    let BranchId: any = 17;
    var imageName: any = BranchId;
    var fileFullPath = "";

    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append("ImageName", imageName);
    formData.append("BranchId", BranchId);
    formData.append("Id", this.categoryId);
    formData.append("fileFullPath", fileFullPath);
    formData.append("siteImageName", siteFile);
    formData.append("appImageName", mobileFile);
    formData.append("imageOptions", this.imageOptions);

    this.http.post(this.baseApiUrl + '/ImageUpload/UploadImageforcategoryHead', formData)
      .subscribe(data => {
        this._snackBar.open('Save Successfully....!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        this.loadingFlag = false;
        this.fnBack();
      }, err => {
        this.loadingFlag = false;
      });
  }

  anchorclick(value) {
    let varArguements = {};
    varArguements = { CategoryID: value };

    let DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'CategoryHead_Get';

    this.appService.post('Master/CategoryHead_Get', DictionaryObject)
      .subscribe(data => {
        let result = data[0];

        this.categoryName = result.CategoryHead_Name;
        this.txtCategoryId = result.CategoryHead_Id;
        this.prodTypeId = result.ProductType_Id.toString();
        this.txtCategoryHeadOrderNo = result.CategoryHead_OrderNo;
        this.txtDisplayName = result.CategoryHead_DisplayName;
        this.txtRemarks = result.CategoryHead_Remarks;
        this.listShow = true;
        this.fnManufactureGetOnCategoryHeadId(result.CategoryHead_Id);
      });
  }

  fnCreate() {
    this.fnCleared();
    setTimeout(() => {
      document.getElementById('txtcategoryname').focus();
    }, 500);
    this.listShow = true;
  }
  fnSearchKey(keyword) {
    let searchText = new RegExp(keyword, 'ig');
    this.dataList = this.tempDataList.filter(x => {
      if (x.CategoryHead_Name) {
        return x.CategoryHead_Name.search(searchText) !== -1;
      }
    });

  }

  fnCleared() {
    this.txtCategoryId = 0;
    this.categoryName = '';
    this.txtCategoryHeadOrderNo = '0';
    this.txtDisplayName = '';
    this.txtRemarks = '';
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
        this.fnGetProductType();
      })
  }

  GetCategory() {
    let varArguements = { Id: this.groupId };

    let DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'CategoryHead_GetOnTypeId';

    this.appService.post('Master/CategoryHeadGetsOnTypeId', DictionaryObject)
      .subscribe(data => {
        this.dataList = data;
        this.tempDataList = data;
        this.fnManufactureGets();
      })
  }
  fnBackTolist() {
    this.GetCategory();
    this.listShow = false;
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

    if (this.txtCategoryId) {
      areaid = this.txtCategoryId;
    }
    if (areaid != 0) {
      let varArguements = {
        CategoryHeadID: areaid, CategoryHeadName: this.categoryName, CategoryHeadType: this.groupId, ProductType_Id: this.prodTypeId,
        CategoryHead_OrderNo: this.txtCategoryHeadOrderNo, CategoryHead_DisplayName: this.txtDisplayName, CategoryHead_Remarks: this.txtRemarks
      };

      let DictionaryObject = {};
      DictionaryObject["dictArgmts"] = varArguements;
      DictionaryObject["ProcName"] = 'CategoryHead_UpdateDetails';
      let body = JSON.stringify(DictionaryObject);
      this.appService.post('Master/CategoryHead_Update', body)
        .subscribe(result => {
          let data: any = result
          if (data == "Already Exists") {
            alert(data);
            return;
          }
          alert('Update Successfully');
          this.fnClear();
          this.GetCategory();

          if (this.groupId == '15') {
            this.fnManufactureWgtCategoryInsert(areaid);
          }

        });
    } else {
      let varArguements = {
        CategoryHeadName: this.categoryName, CategoryHeadType: this.groupId,
        ProductType_Id: this.prodTypeId, CategoryHead_OrderNo: this.txtCategoryHeadOrderNo,
        CategoryHead_DisplayName: this.txtDisplayName, CategoryHead_Remarks: this.txtRemarks
      };

      let DictionaryObject = {};
      DictionaryObject["dictArgmts"] = varArguements;
      DictionaryObject["ProcName"] = 'CategoryHead_InsertDetails';
      let body = JSON.stringify(DictionaryObject);
      this.appService.post('Master/CategoryHead_Insert', DictionaryObject)
        .subscribe(res => {
          let data: any = res;
          this.fnClear();
          if (data == "Already Exists") {
            alert(data);
            return;
          }
          alert('Saved Successfully');
          this.GetCategory();
          let dTempCategoryHeadId = parseFloat(data || 0);

          if (this.groupId == '15') {
            this.fnManufactureWgtCategoryInsert(dTempCategoryHeadId);
          }
        })
    }
  }
  fnManufactureWgtCategoryInsert(val) {
    let dManufactureId = this.ddlManufacture;

    let ServiceParams = {};
    ServiceParams['strProc'] = "CompanyProductGrpInsert";
    ServiceParams['JsonFileName'] = 'JsonScriptThree';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams["strKey"] = "@ParamsProductGroupId";
    ProcParams["strArgmt"] = val;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "@ParamsManufacture_Id";
    ProcParams["strArgmt"] = String(dManufactureId);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', ServiceParams)
      .subscribe(res => {
        let data: any = res;
        let jsonobj = JSON.parse(data.JsonDetails[0]);
      })
  }
  fnManufactureGetOnCategoryHeadId(CategoryHeadId) {

    let ServiceParams = {};
    ServiceParams['strProc'] = "CompanyProductGrpGetOnCategoryHeadId";
    ServiceParams['JsonFileName'] = 'JsonScriptThree';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "@ParamsProductGroupId";
    ProcParams["strArgmt"] = String(CategoryHeadId);
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', ServiceParams)
      .subscribe(res => {
        let data: any = res;
        let JsonObj = JSON.parse(data.JsonDetails[0]);

        if (JsonObj.length) {
          this.ddlManufacture = JsonObj[0].Manufacture_Id;
        }
      }, err => console.error(err))
  }
  fnGetProductType() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "ProductType_GetOnTypeId";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "ProductSpecification";
    ProcParams["strArgmt"] = this.groupId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .subscribe(data => {
        let result:any = data;
        if (result.length) {
          this.productType = result;
          this.prodTypeId = this.productType[0].ProductType_Id;
        }
      })

  }
}
async function getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        resolve(reader.result);
    }, false);

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  })
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}
