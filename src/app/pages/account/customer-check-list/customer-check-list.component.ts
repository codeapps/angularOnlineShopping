import { AppService } from "./../../../app.service";
import { Component, OnInit } from "@angular/core";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { Subject, Observable } from "rxjs";
import { Http } from "@angular/http";
import { MatSnackBar } from "@angular/material";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "src/app/services";

@Component({
  selector: "app-customer-check-list",
  templateUrl: "./customer-check-list.component.html",
  styleUrls: ["./customer-check-list.component.scss"],
})
export class CustomerCheckListComponent implements OnInit {
  createFlag: boolean = true;
  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  dBranchId: any;
  dAcId: any;
  checkListSource: any = {
    uniqueId: 0,
    processigFlag: "Image",
  };
  loadingFlag: boolean = false;
  fileData: any = null;
  previewUrl: any = null;
  tempChecklist: any = [];
  checkLists: any = [];

  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  constructor(
    private http: Http,
    public appService: AppService,
    private _snackBar: MatSnackBar,
    private _localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.dBranchId = this._localStorage.getItem("BranchId");
    this.dAcId = this._localStorage.getItem("CusEShopId");
    this.fngetCheckList();
  }

  //for take a snapshots
  public triggerSnapshot(): void {
    let image = this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info("received webcam image", webcamImage);
    this.webcamImage = webcamImage;
    this.previewUrl = webcamImage.imageAsDataUrl;
    const imageName = "";
    const imageBlob = this.dataURItoBlob(this.webcamImage.imageAsBase64);
    const imageFile = new File([imageBlob], imageName, { type: "image/jpeg" });
    this.fileData = imageFile;
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    return blob;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  //file Changes
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

  public async fnUploadFiles() {
    this.loadingFlag = true;
    let BranchId: any = this.dBranchId;
    var imageName: any = BranchId;
    var fileFullPath = "";
    const formData = new FormData();
    formData.append("file", this.fileData);
    formData.append("CustomerId", this.dAcId);
    formData.append("BranchId", BranchId);
    formData.append("ProcessingFlag", this.checkListSource.processigFlag);
    formData.append("Id", this.checkListSource.uniqueId);

    await this.http.post(this.baseApiUrl + "/ImageUpload/UploadImageS3BrowserForCheckLists",formData)
      .subscribe(
        (res) => {
          this._snackBar.open(
            "Our Deliver Team Contact You Shortly Thank You",
            "×",
            { panelClass: "success", verticalPosition: "top", duration: 3000 }
          );
          this.loadingFlag = false;
          this.previewUrl = null;
          this.fileData = null;
          this.fngetCheckList();
          this.createFlag = true;
        },
        (error) => console.error(error)
      );
  }

  fngetCheckList() {
    let strQuery = `select * from EShopOrderMain where AcId = ${this.dAcId} and BranchId = ${this.dBranchId} and Order_Cancel = 0 and OrderType = 'Image'
                    order by OrderMain_Id desc`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService
      .post("CommonQuery/fnGetDataReportFromQuery", body)
      .subscribe((data) => {
        let _data: any = data;
        let jsonData = JSON.parse(_data.JsonDetails[0]);
        this.tempChecklist = jsonData;
        for (const checklist of this.tempChecklist) {
          let image = "https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360";
          if (checklist.OrderMainImageLoc && this.appService.getImagePath) {
            image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.appService.getImagePath}/${checklist.OrderMainImageLoc}`;
          }
          checklist.OrderMainImageLoc = image;
        }
        this.checkLists = this.tempChecklist;
      });
  }

  fnCancelCheckList(data) {
    if (!confirm("Do You Want To Cancel This Order Now..")) {
      return;
    }
    let strQuery = `Update EShopOrderMain set Order_Cancel = 1 where UniqueId = ${data.UniqueId} and BranchId = ${this.dBranchId} and AcId = ${this.dAcId}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    this.appService
      .post("CommonQuery/fnGetDataReportFromQuery", body)
      .subscribe((data) => {
        this._snackBar.open("Cancel Successfully", "×", {
          panelClass: "error",
          verticalPosition: "top",
          duration: 3000,
        });
        this.fngetCheckList();
      });
  }
  fnSplitWhiteSpace(date) {
    const data = date.split(" ");
    return data[0];
  }
}
