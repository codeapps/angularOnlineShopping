import { Http, Headers } from '@angular/http';
import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { emailValidator, matchingPasswords } from '../../../theme/utils/app-validators';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  infoForm: FormGroup;
  passwordForm: FormGroup;
  AcName: any;
  Email: any;

  password: any;
  show: boolean = false;
  constructor(public appservice: AppService, public formBuilder: FormBuilder,
    public snackBar: MatSnackBar, private _localStorage: LocalStorageService) { }

  ngOnInit() {
    this.appservice.Data.UserDetails.forEach(element => {
      this.AcName = element.AC_Name;
      this.Email = element.Email;
      // this.Phone    = element.Phone;
      // this.Address  = element.Addr1;
      // this.PinCode  = element.Alias;
      // this.ExpDate = element.ExpiryDate;
    });
    // this.infoForm = this.formBuilder.group({
    //   'firstName': [this.AcName, Validators.compose([Validators.required, Validators.minLength(3)])],
    //   'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    //   'email': [this.Email, Validators.compose([Validators.required, emailValidator])]
    // });

    this.passwordForm = this.formBuilder.group({
      'firstName': [this.AcName, Validators.compose([Validators.required, Validators.minLength(3)])],
      'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmNewPassword': ['', Validators.required]
    }, { validator: matchingPasswords('newPassword', 'confirmNewPassword') });

    this.forgotPassword();
  }

  public onInfoFormSubmit(values: Object): void {
    if (this.infoForm.valid) {
      this.snackBar.open('Your account information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  public onPasswordFormSubmit(values: Object): void {
    const AcId = this._localStorage.getItem('CusEShopId');
    if (this.passwordForm.valid) {
      let CurrentPwd = values['currentPassword'];
      let NewPwd = values['confirmNewPassword'];
      let UserName = values['firstName'];

      var ServiceParams = {};

      ServiceParams['strProc'] = 'UserwiseLoginDetailsUpdate';

      let oProcParams = [];

      let ProcParams = {};
      ProcParams['strKey'] = 'AC_Id';
      ProcParams['strArgmt'] = AcId;
      oProcParams.push(ProcParams);


      ProcParams = {};
      ProcParams['strKey'] = 'LoginFlag';
      ProcParams['strArgmt'] = 1;
      oProcParams.push(ProcParams);


      ProcParams = {};
      ProcParams['strKey'] = 'UserName';
      ProcParams['strArgmt'] = UserName;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'Pwd';
      ProcParams['strArgmt'] = NewPwd;
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;
      let body = JSON.stringify(ServiceParams);

      this.appservice.post('OnlineShopV1/fnUserwiseLoginModify', body)
        .subscribe(data => {
          let jsonData = JSON.parse(data);
          this.snackBar.open('Your password ' + jsonData[0].flag + '!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          this.appservice.fnloginOut();
        }, error => console.error(error));


    }
  }

  forgotPassword() {
    let BranchId = this._localStorage.getItem("SessionBranchId");

    let varArguements = {};
    varArguements = { Mail: this.AcName, BranchId: BranchId };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Customer_GetforEshopForPassword';

    let body = JSON.stringify(DictionaryObject);
    this.appservice.post('OnlineShopV1/Customer_GetforEshopForPassword', body).subscribe(data => {
      let jsonData = data;
      this.password = jsonData[0].Pwd;
    });
  }

}
