import { AppService } from './../../app.service';
import { Component, OnInit } from '@angular/core';
import { ButtonRendererComponent } from '../BannerPage/button-renderer.component';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-edit-brands-list',
  templateUrl: './edit-brands-list.component.html',
  styleUrls: ['./edit-brands-list.component.scss']
})
export class EditBrandsListComponent implements OnInit {
  frameworkComponents: { buttonRenderer: any; };
  rowSelection: any;
  manufactureId: any;
  manufactureName: any;
  Manufacture_MFRNo: any;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  manufactureList: any;
  createFlag: boolean = true
  imageName: any;
  sessionWebBranchId: any = '';

  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  loadingFlag: boolean;


  constructor(public appService: AppService, private http: Http,  _localStorage: LocalStorageService) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
    this.rowSelection = 'single';
    this.sessionWebBranchId = _localStorage.getItem("SessionBranchIdWeb");
  }
  columnDefs = [
    {
      headerName: 'Edit',
      cellRenderer: 'buttonRenderer',
      resizable: true,
      width: 60,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
        // label: 'Click 1'
      }
    },
    { field: 'Manufacture_Name', resizable: true, width: 400 ,filter: "agTextColumnFilter"},
    { field: 'Manufacture_MFRNo', resizable: true },
    { field: 'Manufacture_CSTNo2', resizable: true },
  ];


  ngOnInit() {
    this.fnGetManufacture();
  }

  fnGetManufacture() {
    let strQuery = 'select * from Manufacture order by Manufacture_Name';
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {
        var result:any = data;
        this.manufactureList = JSON.parse(result.JsonDetails[0]);
      }, error => (console.error(error)));
  }

  onBtnClick1(e) {
    this.createFlag = false;
    var rowDataClicked1 = e.rowData;
    this.manufactureId = rowDataClicked1.Manufacture_Id;
    this.manufactureName = rowDataClicked1.Manufacture_Name;
    this.Manufacture_MFRNo = rowDataClicked1.Manufacture_MFRNo;
    this.imageName = rowDataClicked1.Manufacture_CSTNo2;

    // var rowDataClicked1 = e.rowData;
    if (rowDataClicked1.Manufacture_CSTNo2 != null || rowDataClicked1.Manufacture_CSTNo2 != "" ) {
      this.previewUrl = 'https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this.appService.getImagePath + '/' + rowDataClicked1.Manufacture_CSTNo2;
    } else {
      this.previewUrl = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360';
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

  fnBack() {
    this.fnGetManufacture();
    this.createFlag = true;
  }

  fnUpdate() {
    this.loadingFlag = true;
    let BranchId: any = this.sessionWebBranchId;
    var fileFullPath = "";
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append("ImageName", this.imageName);
    formData.append("BranchId", BranchId);
    formData.append("Id", this.manufactureId);
    formData.append("fileFullPath", fileFullPath);
    this.http.post(this.baseApiUrl + '/ImageUpload/uploadImageforBrands', formData).subscribe(
      data => {
        alert("saved Successfully");
        this.loadingFlag = false;
        this.fnBack();
      });
  }
}
