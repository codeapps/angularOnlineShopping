import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { AppService } from "../../../app.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  HttpClient,

} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "src/app/services";


@Component({
  selector: "app-slider-page-editing",
  templateUrl: "./slider-page-editing.component.html",
  styleUrls: ["./slider-page-editing.component.scss"],
})
export class SliderPageEditingComponent implements OnInit {
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  saveLoad = false;
  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  slides: any;
  editable: boolean = false;
  tempOffer: any;
  message1: any = "";
  message2: any = "";
  Descriptions: any = "";
  imageName: any;
  sessionWebBranchId: any
  loadingFlag: boolean;

  constructor(
    private http: Http,
    private appService: AppService,
    private _snackBar: MatSnackBar,
    private _localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.sessionWebBranchId = this._localStorage.getItem("SessionBranchIdWeb");
    this.fnGetHomeSlides();
  }
  fnGetHomeSlides() {
    let strQuery = "";
    if (this.sessionWebBranchId == 0) {
      strQuery = "select * from EShopHomeImage";
    } else {
      strQuery =
        "select * from EShopHomeImage where BranchId =" +
        this.sessionWebBranchId;
    }

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post("CommonQuery/fnGetDataReportFromQuery", body)
      .subscribe((data) => {

        var result: any = data;
        var jsonObj = JSON.parse(result.JsonDetails);
        let images: Array<any>;
        var items: any = [];

        for (var i = 0; i < jsonObj.length; i++) {
          images = [];
          var book = null;
          var eachItems = {};

          if (jsonObj[i].EShopHomePage_ImageName != null) {
            book = {
              small:
                "https://s3.ap-south-1.amazonaws.com/productcodeappsimage/" +
                this.appService.getImagePath +
                "/" +
                jsonObj[i].EShopHomePage_ImageName,
              medium:
                "https://s3.ap-south-1.amazonaws.com/productcodeappsimage/" +
                this.appService.getImagePath +
                "/" +
                jsonObj[i].EShopHomePage_ImageName,
              big:
                "https://s3.ap-south-1.amazonaws.com/productcodeappsimage/" +
                this.appService.getImagePath +
                "/" +
                jsonObj[i].EShopHomePage_ImageName,
            };
          } else {
            book = {
              small:
                "https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ",
              medium:
                "https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ",
              big:
                "https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360 ",
            };
          }
          eachItems["id"] = jsonObj[i].UniqueId;
          eachItems["title"] = jsonObj[i].EShopHomePage_msg1;
          eachItems["subtitle"] = jsonObj[i].EShopHomePage_msg2;
          eachItems["Descriptions"] = jsonObj[i].EShopHomePage_msg3;
          eachItems["images"] = book.small;

          items.push(eachItems);
        }
        this.slides = items;
        // setTimeout(() => {
        //  this.config.observer = true;
        // }, 100);
      });
  }
  fnEdit(id) {
    this.editable = true;
    let strQuery = "select * from EShopHomeImage where UniqueId =" + id;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post("CommonQuery/fnGetDataReportFromQuery", body)
      .subscribe((data) => {
        var result: any = data;
        this.tempOffer = JSON.parse(result.JsonDetails);
        this.message1 = this.tempOffer[0].EShopHomePage_msg1;
        this.message2 = this.tempOffer[0].EShopHomePage_msg2;
        this.Descriptions = this.tempOffer[0].EShopHomePage_msg3;
        this.imageName = this.tempOffer[0].EShopHomePage_ImageName;

        if (this.tempOffer[0].EShopHomePage_ImageName != null) {
          this.previewUrl =
            "https://s3.ap-south-1.amazonaws.com/productcodeappsimage/" +
            this.appService.getImagePath +
            "/" +
            this.tempOffer[0].EShopHomePage_ImageName;
        } else {
          this.previewUrl =
            "https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360";
        }
      });
  }
  fnBack() {
    this.editable = false;
    this.fnGetHomeSlides();
  }

  fnupdate(id) {

    let BranchId: any;
    if (this.sessionWebBranchId == 0) {
      BranchId = 0;
    } else {
      BranchId = this.sessionWebBranchId;
    }
    var fileFullPath = "";
    const formData = new FormData();
    formData.append("file", this.fileData);
    formData.append("ImageName", this.imageName);
    formData.append("BranchId", BranchId);
    formData.append("fileFullPath", fileFullPath);
    formData.append("title", this.message1);
    formData.append("subTitle", this.message2);
    formData.append("Description", this.Descriptions);
    formData.append("Id", id);

    // this.http.post(this.baseApiUrl + "/ImageUpload/UploadImageBranchS3Browser", formData)
    //   .subscribe(data => {
    // if (event.type === HttpEventType.UploadProgress)
    //   this.progress = Math.round((100 * event.loaded) / event.total);
    // else if (event.type === HttpEventType.Response) {
    //   this.message = "Upload success.";
    //   this._snackBar.open("Save Successfully...!", "×", {
    //     panelClass: "error",
    //     verticalPosition: "top",
    //     duration: 3000,
    // });

    // this.fnBack();
    // this.onUploadFinished.emit(event.body);
    // }
    // }, err => console.error(err));
    this.saveLoad = true;
    // this.loadi ngFlag = true;
    this.http.post(this.baseApiUrl + '/ImageUpload/UploadImageBranchS3Browser', formData)
      .subscribe(res => {
        this.saveLoad = false;
        this._snackBar.open('Save Successfully...!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        // this.loadingFlag = false;
        this.fnBack();
      }, error => (console.error(error)));
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
    };
  }

  fndelete(id) {
    if (!confirm("Are You Sure to Delete the Slide")) {
      return;
    }

    let strQuery = "delete from EShopHomeImage where UniqueId = " + id;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post("CommonQuery/fnGetDataReportFromQuery", body)
      .subscribe((data) => {
        this._snackBar.open("Deleted Successfully....!", "×", {
          panelClass: "error",
          verticalPosition: "top",
          duration: 3000,
        });
        this.fnBack();
      });
  }
}
