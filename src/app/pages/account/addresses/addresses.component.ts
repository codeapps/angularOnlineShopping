import { Http, Headers } from '@angular/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, NgForm, AbstractControl } from '@angular/forms';
import { AppService } from '../../../app.service';
import { AccountsService } from 'src/app/services';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { AlertModalComponent } from 'src/app/theme/components/alert-modal/alert-modal.component';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  billingForm: FormGroup;

  countries = [];
  loading: boolean = false;
  saveShow: boolean;
  branchId: any;
  txtpassword: any;
  confirmLogin: boolean;
  CustId: any;
  AcId: any;
  selectedTab: number = 0;

  public tabs: any[] = []

  constructor(public appService: AppService, public formBuilder: FormBuilder,private dialog: MatDialog,
    public snackBar: MatSnackBar, private accountService: AccountsService,
    public dialogRef: MatDialogRef<AddressesComponent>,
    @Inject(MAT_DIALOG_DATA) public capture: any) {

      // this.capture.winparams
      // this.capture.placeidx

  }

  ngOnInit() {
    this.AcId = this.appService._localStorage.getItem('CusEShopId');
    this.branchId = this.appService._localStorage.getItem('SessionBranchId');
    this.countries = this.appService.getCountries();

    this.billingForm = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': [''],
      'middleName': '',
      'address3': '',
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'phone': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')])],
      'country': ['IN', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'zip': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2':  ['', Validators.required]
    });


    this.fnAcidisValid();
  }

  close() {
    this.dialogRef.close();
  }

  addShippingAddressTab() {
    let object = { label: 'shipping Address', forms: {} };
    this.tabs.push(object);
    this.selectedTab = this.tabs.length;
  }

  fnShippingAddressGet() {
    this.tabs = [];
    this.accountService.onShippingAddressGet(this.AcId)
      .toPromise().then(res => {
        let jsonArray = JSON.parse(res.JsonDetails[0]);
        if (jsonArray.length)
          jsonArray.map(x => {
            let object = { label: 'shipping Address', forms: x };
            this.tabs.push(object);

          });
        setTimeout(() => {
          if (this.capture.winparams) {
            this.selectedTab = this.capture.placeidx;
            }
        });


      });
  }

  removeTabs() {

    const index = this.selectedTab - 1;
    const itemTab = this.tabs[index];

    if (itemTab.forms.ShippingDetails_Id) {
      const id = itemTab.forms.ShippingDetails_Id;
      this.onAlertDialogue(id, index);
    } else {
      this.tabs.splice(index, 1);
    }
  }

  fnRemoveShippingAddress(id, index) {
    this.accountService.onRemoveShippingAddress(id)
      .subscribe(res => {
        this.tabs.splice(index, 1);
        this.snackBar.open('Address remove successfully!', '', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    })
  }

  onAlertDialogue(id, index) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      // width: '250px',
      data: { header: 'Warning!!', message: 'Are you sure want to delete Address.' },
      hasBackdrop: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fnRemoveShippingAddress(id, index);
    });
  }

  fnConfirmPassword(password) {

    let acName = this.billingForm.get('firstName').value
    this.accountService.confirmPassword(acName, password, this.branchId)
      .map(data => data)
      .subscribe(data => {

        if (data.length !== 0) {
          this.txtpassword = password;
          this.onBillingFormSubmit();
        } else {
          this.snackBar.open('Enter Valid Password!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        }
      }, error => (console.error(error)));

  }

  onPasswordCheck(userForm: NgForm) {

    if (userForm.form.valid) {
      this.fnConfirmPassword(userForm.form.value.password);
    }
  }

  fnValidation() {

    if (this.billingForm.valid) {
      this.confirmLogin = true;
    }

  }

  public async onBillingFormSubmit(): Promise<void> {

    this.confirmLogin = false;
    if (this.billingForm.valid && !this.loading) {
      this.loading = true;
      let CustId = this.CustId;
      this.accountService.onBillingAddressSave(this.billingForm.value, CustId, this.txtpassword, this.branchId)
        .toPromise().then(data => {
          this.loading = false;
          let jsonobjdata = data;

          this.snackBar.open('Your billing address information ' + jsonobjdata + ' successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          if (this.capture.winparams) {
            this.close();
          }
        }, error => this.loading = false);

    }
  }

  fnAcidisValid() {
    let acId = this.AcId;
    this.accountService.onAcIdValidate(acId)
      .toPromise().then(data => {
        let _data: any = data;
        let IssueRouteHeadList = JSON.parse(_data.JsonDetails[0]);

        if (IssueRouteHeadList.length !== 0) {
          this.saveShow = true;
          let AcName = IssueRouteHeadList[0].CustName;
          let Email = IssueRouteHeadList[0].Mail;
          let Phone = IssueRouteHeadList[0].Phone1;
          let Address1 = IssueRouteHeadList[0].Address;
          let Address2 = IssueRouteHeadList[0].Address1;
          let PinCode = IssueRouteHeadList[0].Alias;
          let ExpDate = IssueRouteHeadList[0].Expired;
          this.branchId = IssueRouteHeadList[0].BranchId;
          this.CustId = IssueRouteHeadList[0].CustId;
          let State = IssueRouteHeadList[0].CurrentLocationLong;
          let City = IssueRouteHeadList[0].ContactPerson;
          // let CountryCode = String(IssueRouteHeadList[0].BranchCode);
          let address3 = IssueRouteHeadList[0].CurrentLocationLat;
          let lastName = IssueRouteHeadList[0].LastName;

          this.billingForm.setValue({
            firstName: AcName, lastName: lastName, middleName: '',
            address3: address3, email: Email, phone: Phone, country: 'IN',
            city: City, state: State, zip: PinCode, address1: Address1,address2: Address2
          });

        } else {
          this.appService.Data.UserDetails.forEach(element => {
            let AcName = element.AC_Name;
            let Email = element.Email;
            let Phone = element.Phone;
            let Address1 = element.Addr1;
            let Address2 = element.Addr2;
            let PinCode = element.Alias;
            let ExpDate = element.ExpiryDate;
            this.branchId = element.BranchId;
            this.billingForm.setValue({
              firstName: AcName, lastName: '', middleName: '',
              address3: '', email: Email, phone: Phone, country: 'IN',
              city: '', state: '', zip: PinCode, address1: Address1,address2: Address2
            });
          });


          this.saveShow = false;
        }
      }).finally(() => {
        this.fnShippingAddressGet();
      }).catch(err => this.saveShow = false);
  }
}
