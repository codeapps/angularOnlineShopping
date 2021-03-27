import { AppService } from 'src/app/app.service';

import { Component, Inject, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatOptionSelectionChange, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';

import { MatStepper } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/services';

export interface State {
  MapBranchId: string;
  MapDistrict: string;
  Area_Name: string;
  MapPinCode: string;
  MapState: string;
  UniqueKey: string;
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @ViewChild('verticalStepper', { static: false }) verticalStepper: MatStepper;

  loginForm: FormGroup;
  registerForm: FormGroup;
  txtemail;
  txtpassword;
  jsondata: any;
  CusId: any;
  jsonobjdata: any;
  txtCustName: any;
  txtPwd: any;
  txtPhone: number;
  txtPinCode: number;
  txtAddr1: any;
  txtAddr2: any;
  txtEmail: any;
  txtCustId: any;
  PriceMenuId: string = '0';
  branchZip = [];
  filteredStates: Observable<State[]>;
  branchId: any;
  OtpData: any = [];
  otpFlag: boolean;
  otpFlagSuccess: boolean;
  sessionWebBranchId: any = "";
  otpSmsAllowed: any;
  loginFlag: string = 'No';
  signupFlag: any;

  constructor(public appservice: AppService, public formBuilder: FormBuilder,
    public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog,
    private _localStorage: LocalStorageService) {
    this.sessionWebBranchId = Number(_localStorage.getItem("SessionBranchIdWeb"));
  }

  private _filterStates(value: string): State[] {
    const filterValue = value;
    return this.branchZip.filter(state => state.MapPinCode.indexOf(filterValue) === 0);
  }
  ngOnInit() {
    this.fnGettingVisibles();

    this.loginForm = this.formBuilder.group({
      // 'email': ['', Validators.compose([Validators.required, emailValidator])],
      'userid': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });

    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'confirmPassword': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': '',
      'Phone': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')])],
      'Pincode': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])]
    }, { validator: matchingPasswords('password', 'confirmPassword') });

    this.filteredStates = this.registerForm.controls.Pincode.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.branchZip.slice())
      );
    setTimeout(() => {
      this.fnZipcodeValid();
      let inputElement = document.getElementById('txtuserName');
      if (inputElement)
        inputElement.focus();
    }, 200);
  }

  ngOnChanges() {
    this.fnZipcodeValid();
  }

  fnchangePin(branchid) {
    this.branchId = branchid;
  }

  // public onLoginFormSubmit(values:Object):void {
  //   if (this.loginForm.valid) {
  //     this.router.navigate(['/']);
  //   }
  // }

  // public onRegisterFormSubmit(values:Object):void {
  //   if (this.registerForm.valid) {
  //     this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
  //   }
  // }
  fnpincodevailid() {
    let keyword = this.registerForm.controls.Pincode.value;
    if (keyword) {
      let controls = keyword.toString().length;
      if (controls == 6) {
        let BranchId = this.branchZip.filter(state => state.MapPinCode.indexOf(keyword) === 0);
        if (BranchId.length == 0) {
          return 0;
        }
        return BranchId[0].MapBranchId;
      } else {
        return 0;
      }

    } else {
      return 0;
    }
  }
  public onRegisterFormSubmit(values: Object): void {
    if (this.sessionWebBranchId == 0) {
      this.branchId = parseFloat(this.fnpincodevailid());
    } else {
      this.branchId = this.sessionWebBranchId;
    }


    this.txtCustId = 0;
    if (this.branchId == 0) {
      this.snackBar.open('Enter valid Zipcode!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      return;
    }
    if (this.registerForm.valid) {

      this.txtCustName = values['name'];
      this.txtPwd = values['password'];
      this.txtPhone = values['Phone'];
      this.txtPinCode = values['Pincode'];
      this.txtAddr1 = values['address1'];
      this.txtAddr2 = values['address2'];
      this.txtEmail = values['email'];

      let CustId = 0;
      let varArguements = {};

      if (this.txtCustId != '') {
        CustId = this.txtCustId;
      }
      if (CustId != 0) {

        varArguements = {
          CustId: CustId, CustName: this.txtCustName, Gender: '', CustType: '',
          Address: this.txtAddr1, Phone1: this.txtPhone, Phone2: '', Fax: '',
          Mail: this.txtEmail, ContactPerson: '', Active: '', Points: '',
          CustGrpID: '', CustPhoto: '', Remarks: '', DOB: '', Area_Description: '', Expired: '',
          BranchCode: '', Subscription: '', ICNo: '', DOBDay: '', DOBMonth: '',
          DOBYear: '', EditDate: '', PCode: this.txtPinCode, FirstName: '', LastName: '',
          CategoryID: '', IntroID: '', ProductPoint: 0, ServicePoint: '', Staff: '',
          Alias: this.txtPinCode, PagProductPoint: 0, ImageLoc: '', Height: 0, Weight: 0,
          AreaId: 0, MaritalStatus: '', Race: '', Occupation: '', bSelect: '',
          Blacklisted: '', LostCard: '', Password: this.txtPwd, UniqueDeviceId: this.txtCustName, FacebookId: '',
          FbAcessTokens: '', PicUrl: '', SquarePicUrl: '', ProfileDescription: '', CurrentLocationLat: '', CurrentLocationLong: '',
          DLNo1: '', DLNo2: '', Tin1: '', Tin2: '', CstNo1: '', CrLmtDays: '',
          CrLmtAmt: '', StaffId: 0, Address1: this.txtAddr2, PriceMenuId: '', BranchId: this.branchId, Media: 0

        };
        var DictionaryObject = {};
        DictionaryObject['dictArgmts'] = varArguements;
        DictionaryObject['ProcName'] = 'Customer_UpdateEShop';

        let body = JSON.stringify(DictionaryObject);
        this.appservice.post('OnlineShopV1/Customer_Update', body)
          .subscribe(data => {

            this.jsonobjdata = data;

            if (this.jsonobjdata != 'Already Exists') {
            } else {

              this._localStorage.setItem('CusEShopId', this.jsonobjdata);
              this.appservice.onLogin(this.jsonobjdata);
              this._localStorage.setItem('SessionBranchId', this.branchId);
              return;
            }

            this.txtCustId = 0;
          });
      } else {
        if (this.otpSmsAllowed == 'Yes') {
          this.fnOtpVerifications();
        } else {
          this.fnOnSaveAccountHead();
        }

      }
    }

  }
  async fnOtpVerifications() {
    var otpNumer = Math.floor(1000 + Math.random() * 9000);
    let otpDate = new Date();
    let otpMobNumber = this.txtPhone;
    let otpExpDate = new Date()
    otpExpDate = new Date(otpExpDate.getTime() + 20000);
    var otpDataDetails = {
      otp_number: otpNumer,
      otp_Date: otpDate,
      otp_MobNumber: otpMobNumber,
      otp_ExpDate: otpExpDate
    }
    this.otpFlag = true
    this.OtpData.push(otpDataDetails);
    let Message = ' Dear ' + this.txtCustName + ' Your One Time Password is ' + otpNumer + ' Please don not share this OTP to anyone Thank You';
    let MessageCounterInfo = {};
    MessageCounterInfo['MessageTo'] = otpMobNumber;
    MessageCounterInfo['Information'] = Message;
    MessageCounterInfo['StaffId'] = 0;
    MessageCounterInfo['BranchId'] = parseFloat(this.sessionWebBranchId || 0);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let body = JSON.stringify(MessageCounterInfo);
    await this.appservice.post('CommonQuery/SmsSent', body).toPromise()
      .then(data => {

      });
  }
  onOtpChange(otp: number) {
    var otpCount = otp.toLocaleString();
    var otplength = otpCount.length
    let ExpDate = new Date();
    if (this.OtpData.length > 0) {
      const otpDataFilter = this.OtpData.filter(res => res.otp_number == otp);
      if (otpDataFilter.length > 0) {
        this.otpFlag = false;
        this.fnOnSaveAccountHead();
      }
      else if (otplength == 4) {
        otplength = 0;
        this.snackBar.open("Your Otp is wrong", '×', { panelClass: 'otpverification', verticalPosition: 'top', duration: 3000 });
      }
    }
  }

  fnOnSaveAccountHead() {
    let varArguements = {
      CustId: 0, CustName: this.txtCustName, Gender: '', CustType: '',
      Address: this.txtAddr1, Phone1: this.txtPhone, Phone2: '', Fax: '',
      Mail: this.txtEmail, ContactPerson: '', Active: '', Points: '',
      CustGrpID: '', CustPhoto: '', Remarks: '', DOB: '', Area_Description: '', Expired: '',
      BranchCode: '', Subscription: '', ICNo: '', DOBDay: '', DOBMonth: '',
      DOBYear: '', EditDate: '', PCode: this.txtPinCode, FirstName: '', LastName: '',
      CategoryID: '', IntroID: '', ProductPoint: 0, ServicePoint: '', Staff: '',
      Alias: this.txtPinCode, PagProductPoint: 0, ImageLoc: '', Height: 0, Weight: 0,
      AreaId: 0, MaritalStatus: '', Race: '', Occupation: '', bSelect: '',
      Blacklisted: '', LostCard: '', Password: this.txtPwd, UniqueDeviceId: this.txtCustName, FacebookId: '',
      FbAcessTokens: '', PicUrl: '', SquarePicUrl: '', ProfileDescription: '', CurrentLocationLat: '', CurrentLocationLong: '',
      DLNo1: '', DLNo2: '', Tin1: '', Tin2: '', CstNo1: '', CrLmtDays: '',
      CrLmtAmt: '', StaffId: 0, Address1: this.txtAddr2, PriceMenuId: '', BranchId: this.branchId, Media: 0

    };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Customer_InsertForEShop';
    let body = JSON.stringify(DictionaryObject);
    this.appservice.post('OnlineShopV1/Customer_InsertEshop', body)
      .subscribe(data => {
        this.jsonobjdata = data;
        if (this.jsonobjdata == undefined || this.jsonobjdata == null) {
          this.snackBar.open("Name Or Email Already Exist", '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
          return;
        } else {
          this.txtCustId = this.jsonobjdata;
          this._localStorage.setItem('CusEShopId', this.jsonobjdata);
          this._localStorage.setItem('SessionPriceMenuId', this.PriceMenuId);
          this.appservice.onLogin(this.jsonobjdata);
          this._localStorage.setItem('SessionBranchId', this.branchId);
          this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          // window.location.href = '/';
          this.router.navigate(['/']);
        }
      });

  }

  public onLoginFormSubmit(values: Object): void {

    if (this.loginForm.valid) {
      this.txtemail = values['userid'];
      this.txtpassword = values['password'];

      var varArguements = {};
      varArguements = { Mail: this.txtemail, password: this.txtpassword, BranchId: this.sessionWebBranchId };

      var DictionaryObject = {};
      DictionaryObject['dictArgmts'] = varArguements;
      if (this.sessionWebBranchId == 0) {
        DictionaryObject['ProcName'] = 'Customer_GetforEshop';
      } else {
        DictionaryObject['ProcName'] = 'Customer_GetforEshopWithBranchId';
      }

      let body = JSON.stringify(DictionaryObject);
      this.appservice.post('OnlineShopV1/Customer_GetforEshop', body)
        .map(data => data)
        .subscribe(data => {

          for (var i = 0; i < data.length; i++) {

            this.CusId = data[i].AC_Id;
            this.PriceMenuId = data[i].PriceMenuId;
            this.branchId = data[i].BranchId;
            this._localStorage.setItem('CusEShopId', this.CusId);
            this.appservice.onLogin(this.CusId);
            this._localStorage.setItem('SessionPriceMenuId', this.PriceMenuId);
            this._localStorage.setItem('SessionBranchId', this.branchId);
          }

          if (data.length > 0) {
            // window.location.href = '/';
            this.router.navigate(['/']);

          } else {
            this.snackBar.open('Invalid Username or Password!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
            return;
          }

        });

    }

  }

  fnZipcodeValid() {
    let strQuery = `select * from MapBranchPincode left outer join Area on MapBranchPincode.AreaId = Area.Area_Id where MapBranchId = ${this.sessionWebBranchId}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    this.appservice.post('CommonQuery/fnGetDataReportFromQuery', body)
      .subscribe(data => {
        let IssueRouteHeadList = JSON.parse(data.JsonDetails[0]);
        this.branchZip = IssueRouteHeadList;
      }, error => console.error(error));
    this.fngetSettings();
  }

  fngetSettings() {
    this.appservice.onSettings('OtpSmsAllowed')
      .subscribe(data => {
        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.otpSmsAllowed = jsonData[0].Value;

      }, error => console.error(error));
  }

  forgotPassword() {
    if (this.sessionWebBranchId == 0) {
      this.branchId = parseFloat(this.fnpincodevailid());
    } else {
      this.branchId = this.sessionWebBranchId;
    }

    let userName = this.loginForm.value["userid"];
    if (userName == '' || userName == null) {
      this.snackBar.open("Please Given UserName", '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      return;
    }
    let varArguements = {};
    varArguements = { Mail: userName, BranchId: this.branchId };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Customer_GetforEshopForPassword';

    let body = JSON.stringify(DictionaryObject);
    this.appservice.post('OnlineShopV1/Customer_GetforEshopForPassword', body).subscribe(data => {
      let jsonData = data;

      if (jsonData.length == 0) {
        this.snackBar.open("User Name is Invalid", '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        return;
      }
      if (this.otpSmsAllowed == 'Yes') {
        this.fnMessageToForgotPassword(jsonData[0])
      } else {
        this.snackBar.open(" Sorry For Your inconvenience Server Is Busy Now", '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      }
    });
  }

  fnMessageToForgotPassword(customer) {

    let Message = ' Dear ' + customer.AC_Name + ' Your UserName is ' + customer.UserName + ' And Password Is ' + customer.Pwd + ' Thank You';
    let MessageCounterInfo = {};
    MessageCounterInfo['MessageTo'] = customer.Phone;
    MessageCounterInfo['Information'] = Message;
    MessageCounterInfo['StaffId'] = 0;
    MessageCounterInfo['BranchId'] = parseFloat(this.sessionWebBranchId || 0);
    let body = JSON.stringify(MessageCounterInfo);
    this.appservice.post('CommonQuery/SmsSent', body).toPromise()
      .then(data => {

      });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(pincodeDialog,
      {
        width: '1000px',
        hasBackdrop: true,
        data: this.branchZip,
        disableClose: false
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.MapPinCode) {
      this.registerForm.controls['Pincode'].setValue(result.MapPinCode);
        this.branchId = result.MapBranchId;
      }
    });
  }



  fnGettingVisibles() {
    this.appservice.onOrderWebAddressBranch()
      .subscribe(res => {
        let jsonData = JSON.parse(res.JsonDetails[0]);
        let jsonWeb = this.appservice.onFindUrlValidate(jsonData);
        if (jsonWeb) {
          this.loginFlag = jsonWeb.LoginVisible;
          this.signupFlag = jsonWeb.SignUpVisible;
        }
      });
  }
}


@Component({
  selector: 'pincodeDialog',
  templateUrl: 'pincode-dialog.html',
  styleUrls: ['./sign-in.component.scss']
})

export class pincodeDialog implements OnInit {
  letters: any = [];
  public searchText: string;
  public pincodeLists = [];
  tempPincodes: any = [];
  Allpincodes: any;
  constructor(public dialogRef: MatDialogRef<pincodeDialog>, @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit(): void {
    this.Allpincodes = this.data;
    this.fnAssignLetters();

    this.pincodeLists.sort((a, b) => {
      if (a.Manufacture_Name < b.Manufacture_Name) return -1;
      if (a.Manufacture_Name > b.Manufacture_Name) return 1;
      return 0;
    });
  }
  fnAssignLetters() {
    var count = 0;
    var brandid;
    for (var i = 0; i < this.Allpincodes.length; i++) {
      if (this.Allpincodes[i].Area_Name == null || this.Allpincodes[i].Area_Name == undefined) {
        this.Allpincodes[i].Area_Name = '';
      }
      brandid = this.Allpincodes[i].UniqueKey;
      var letter = this.Allpincodes[i].Area_Name.charAt(0)
      if (this.letters[count - 1] != letter) {
        this.letters.push(letter);
        count += 1;
      }
      this.tempPincodes.push(brandid);
    }
    this.pincodeLists = this.Allpincodes;
  }

  fnSelectPin(item) {
    this.dialogRef.close(item);
  }
  fnClose() {
    this.dialogRef.close(0);
  }
}
