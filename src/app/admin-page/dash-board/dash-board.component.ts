import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services';
import { MatDialog } from '@angular/material';
import { AlertModalComponent } from 'src/app/theme/components/alert-modal/alert-modal.component';
import { AppSettings } from 'src/app/app.settings';

const httpOptions = {
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'charset=utf-8'
  })
};

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  branchList: any;
  weebBranchId: any;
  webUrl: any;
  createFlag: boolean = true;
  OrderWebAddressBranchList: any;
  uniqueId: any = 0;
  OrderBasedOnPincode: any;
  otpSmsAllowed: any;
  ShoppingPaymentMaxPrice: any;
  ShoppingServiceCharge: any;
  controlAllowed: string = 'No';
  docurl: string = '';
  sessionWebBranchId: string = '';
  constructor(private _snackBar: MatSnackBar,public dialog: MatDialog,public appSettings: AppSettings,
     _localStorage: LocalStorageService, public appService: AppService, public router: Router) {
    this.sessionWebBranchId = _localStorage.getItem("SessionBranchIdWeb");
    this.docurl = document.location.protocol + '//' + document.location.hostname;
    }

  ngOnInit() {
    this.fngetBranches();
  }

  removeAllSlider() {
    if (!confirm('Are you sure you want to delete all slider..!')) {
      return;
    }
    let strQuery = 'delete from EShopHomeImage';
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .subscribe(data => {
        this._snackBar.open('Delete All Slider Successfully...!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

      }, error => (console.error(error)));
  }

  fngetBranches() {
    let strQuery = 'Select * from Branch';
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {
        let jsonData:any = data;
        this.branchList = JSON.parse(jsonData.JsonDetails[0]);
        this.fngetAllWebAddress();
      }, error => (console.error(error)));
  }
  // this._localStorage.getItem("SessionBranchIdWeb");
  fngetAllWebAddress() {
    this.appService.onOrderWebAddressBranch().subscribe(data => {
        let jsonData = data;

      let branchData = JSON.parse(jsonData.JsonDetails[0]);
      if (this.docurl == 'https://ed.codeappsweb.in') {
        this.OrderWebAddressBranchList = branchData
      } else {
        let filterData = branchData.filter(x => x.BranchId == this.sessionWebBranchId);
        this.OrderWebAddressBranchList = filterData;
      }
        this.fngetSettings();
      }, error => (console.error(error)));
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    this.webUrl = data.WebAddress;
    this.weebBranchId = data.BranchId;
    this.uniqueId = data.Unique_Id;
  }

  fnCreate() {
    this.createFlag = false;
  }

  fnBack() {
    this.fngetAllWebAddress();
    this.createFlag = true;
    this.fnClear();
  }

  fnClear() {
    this.webUrl = '';
    this.weebBranchId = '';
    this.uniqueId = 0;
  }

  fnSave() {
    if ((this.webUrl == '' || this.webUrl == null) && (this.weebBranchId == '' || this.weebBranchId == null)) {
      alert("Please Enter The Fields");
      return;
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = 'InsertOrderWebAddressBranch';
    ServiceParams['JsonFileName'] = 'JsonScriptFour';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsuniqueId';
    ProcParams['strArgmt'] = this.uniqueId.toString();
    oProcParams.push(ProcParams);

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.weebBranchId.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = '@ParamsWebAddress';
    ProcParams['strArgmt'] = this.webUrl;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      let val:any = data;
      let jsonData = JSON.parse(val.JsonDetails[0]);
      alert(jsonData[0].Flag);
      this.fnBack();
      window.location.reload();
    });
  }

  fnRemove(data) {

    let strQuery = 'delete from OrderWebAddressBranch where Unique_Id =' + data.Unique_Id;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {
        alert("Removed Successfully..");
        this.fnBack();
      }, error => (console.error(error)));
  }
  onAlertDialogue(data) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      // width: '250px',
      data: { header: 'Warning!!', message: 'Are you sure want to delete branch.' },
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fnRemove(data);
    });
  }

  fngetSettings() {
    let strQuery = 'Select * from Settings';
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {
        let value:any = data;
        let jsonData = JSON.parse(value.JsonDetails[0]);

        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i].KeyValue == 'OrderBasedOnPincode') {
            this.OrderBasedOnPincode = jsonData[i].Value;
          } else if (jsonData[i].KeyValue == 'OtpSmsAllowed') {
            this.otpSmsAllowed = jsonData[i].Value;
          } else if (jsonData[i].KeyValue == 'ShoppingPaymentMaxPrice') {
            this.ShoppingPaymentMaxPrice = jsonData[i].Value;
          }
          else if (jsonData[i].KeyValue == 'ShoppingServiceCharge') {
            this.ShoppingServiceCharge = jsonData[i].Value;
          }
          else if (jsonData[i].KeyValue == 'ShoppingControlView') {
            this.controlAllowed = jsonData[i].Value;
            sessionStorage.setItem('controlview', jsonData[i].Value)
          }

        }
      }, error => (console.error(error)));
  }

  fnSaveGeneralSetting() {

    let strQuery = 'update Settings set Value =' + "'" + this.OrderBasedOnPincode + "'" + ' where KeyValue = ' + "'OrderBasedOnPincode'"
      + ' Update Settings set Value =' + "'" + this.otpSmsAllowed + "'" + ' Where KeyValue = ' + "'OtpSmsAllowed'"
      + ' Update Settings set Value =' + "'" + this.ShoppingPaymentMaxPrice + "'" + ' Where KeyValue = ' + "'ShoppingPaymentMaxPrice'"
      + ' Update Settings set Value =' + "'" + this.ShoppingServiceCharge + "'" + ' Where KeyValue = ' + "'ShoppingServiceCharge'"
      + ' Update Settings set Value =' + "'" + this.controlAllowed + "'" + ' Where KeyValue = ' + "'ShoppingControlView'"
      + ' Update Settings set Value =' + "'" + this.appSettings.settings.theme + "'" + ' Where KeyValue = ' + "'SColor'"

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .subscribe(data => {
        alert("Updated Successfully..");
        sessionStorage.removeItem('controlview');

        this.fngetSettings();
      }, error => (console.error(error)));
  }

  fnFilterBranch(id) {
    if (id == null || id == '' || id == undefined) {
      return;
    }
    const Data = this.branchList.filter(res => res.BranchId == id);

    return Data[0].BranchName;
  }

  fnRouteToBranchFilter(data) {
    this.router.navigate(['/editManufactureBranch', data]);
  }

  changeColor(color: string) {
    this.appSettings.settings.theme = color;
  }
}
