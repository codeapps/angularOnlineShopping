import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { AppService } from '../../app.service';

import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { AccountsService, LocalStorageService } from 'src/app/services';
import { AddressesComponent } from '../account/addresses/addresses.component';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})

export class CheckoutComponent implements OnInit, AfterViewInit {

  @ViewChild('horizontalStepper', { static: false }) horizontalStepper: MatStepper;
  @ViewChild('verticalStepper', { static: false }) verticalStepper: MatStepper;


  deliveryForm: FormGroup;
  paymentForm: FormGroup;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  UserType: any;
  public custToken = null;
  public loading: boolean;
  favoriteSeason: any;

  dSessionBranchId: any;
  public errorMessage: string;
  public successMessage: string;

  smsPop: boolean;
  BranchMobileNo: any;
  branchName: any;
  OrderId: any;
  stripeTest: FormGroup;
  firstFormGroup: FormGroup;
  successpayment: boolean = false;
  Total: number;
  confirmationModel: boolean = false;
  maxChargeforService: any;
  servicecharges: any = 0.00;
  DisAmount: number;
  selectedIndex: any;
  confirmorder: boolean;
  shippingAddrForm: FormGroup;
  shippingArray: any[] = [];

  // optional parameters

  constructor(public appService: AppService, public formBuilder: FormBuilder,
    private router: Router, private accountService: AccountsService,private dialog: MatDialog,
    private _localStorage: LocalStorageService) { }


  ngOnInit() {
    this.fnsettings();
    this.stripeTest = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.custToken = this._localStorage.getItem('CusEShopId');
    this.dSessionBranchId = this._localStorage.getItem('SessionBranchId');

    this.countries = this.appService.getCountries();
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    this.deliveryMethods = this.appService.getDeliveryMethods();


    this.deliveryForm = this.formBuilder.group({
      deliveryMethod: [this.deliveryMethods[0], Validators.required]
    });

    this.paymentForm = this.formBuilder.group({
      radioValue: ['COD', Validators.required],
    });

    this.shippingAddrForm= this.formBuilder.group({
      shippingAddrMethod: ['', Validators.required]
    });
    // if (this.grandTotal == 0) {
    //   this.router.navigateByUrl('');
    // }

  }

  ngAfterViewInit() {


  }

  fnsettings() {
    let keyvalue = "'ShoppingPaymentMaxPrice'";
    let keyvalue2 = "'ShoppingServiceCharge'"
    let strQuery = 'select value from Settings where KeyValue =' + keyvalue + 'or KeyValue = ' + keyvalue2
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      result => {
        var data = result;
        let obj = JSON.parse(data.JsonDetails[0]);
        if (obj.length > 0) {
          this.maxChargeforService = obj[0].value;
          this.servicecharges = obj[1].value;
        } else {
          this.maxChargeforService = 0;
          this.servicecharges = 0;
        }
        this.fngrandtotal(this.maxChargeforService);
      }
    );
  }

  fngrandtotal(value) {
    let Total = 0;
    let discAmt = 0;
    let service = this.servicecharges;
    this.appService.Data.cartList.forEach(product => {
      // - (product.newPrice * product.discount) / 100
      Total += product.cartCount * (product.newPrice - (product.newPrice * product.discount) / 100);
      if (product.discount != 0) {
        discAmt += (product.cartCount * product.newPrice);
      }
    });
    this.DisAmount = discAmt - Total;
    if (Total == 0) {
      this.router.navigateByUrl('');
      return
    }

    if (Total < value) {
      this.grandTotal = ((Total * 1) + (service * 1));
    } else {
      this.grandTotal = Total;
      this.servicecharges = 0.00;
    }
    this.fnselectBranch();

  }

  onAddOrEditAddress(index) {
    const dialogRef = this.dialog.open(AddressesComponent, {
      // width: '250px',
      data: { placeidx: index, winparams: 'address' },

      hasBackdrop: true,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      this.fnAcidisValid();
    });
  }

  public placeOrder() {

    this.loading = true;
    let OrderMain_Id: any = this._localStorage.getItem('sessionOrderMainId');
    let Ordersubuniqueid: any = this._localStorage.getItem('sessionUniqueId');
    const object = this.shippingAddrForm.get('shippingAddrMethod').value;
    const cusName = object.firstName;

    let date = new Date().toISOString();
    let currentTime = new Date().toLocaleTimeString();
    let billdate = date.split('T')[0];

    const shippingAddrId = object.id;
    if (!OrderMain_Id) {
      OrderMain_Id = 0;
      Ordersubuniqueid = 0;
    }

    let jsonObjMain = [];
    let EShopOrderMainInfo = {};
    EShopOrderMainInfo['UniqueId'] = parseFloat(Ordersubuniqueid || 0);
    EShopOrderMainInfo['OrderMain_Id'] = parseFloat(OrderMain_Id || 0);
    EShopOrderMainInfo['OrderMain_CustomerName'] = cusName;
    EShopOrderMainInfo['AcId'] = parseFloat(this.custToken || 0);
    EShopOrderMainInfo['OrderMain_TotTaxAmt'] = this.appService.Data.totalPrice;
    EShopOrderMainInfo['OrderMain_Total'] = this.grandTotal;
    EShopOrderMainInfo['OrderMain_Time'] = currentTime;
    EShopOrderMainInfo['OrderMain_Date'] = billdate;
    EShopOrderMainInfo['OrderMain_DeliverDate'] = billdate;
    EShopOrderMainInfo['OrderMain_DeliveryTime'] = 0;
    EShopOrderMainInfo['OrderMain_DisPers'] = 0;
    EShopOrderMainInfo['OrderMain_DisAmt'] = 0;
    EShopOrderMainInfo['OrderMain_ShippingChrge'] = parseFloat(this.servicecharges || 0);
    EShopOrderMainInfo['OrderMain_Flag'] = 'Ordered';
    EShopOrderMainInfo['OrderMain_Field1'] = '';
    EShopOrderMainInfo['OrderMain_Field2'] = '';
    EShopOrderMainInfo['BranchId'] = parseFloat(this.dSessionBranchId || 0);
    EShopOrderMainInfo['OrderType'] = 'Items';
    EShopOrderMainInfo['ShippingDetails_Id'] = parseFloat(shippingAddrId|| 0);
    jsonObjMain.push(EShopOrderMainInfo);

    let jsonObj = [];

    let ID = this.appService.Data.cartList.length;

    this.appService.Data.cartList.forEach(function (value, key) {
      if (ID != 0 && value.id != 0) {
        let EShopOrderDetailsInfo = {};
        EShopOrderDetailsInfo['OrderMain_Id'] = parseFloat(OrderMain_Id || 0),
          EShopOrderDetailsInfo['ProductId'] = value.id,
          EShopOrderDetailsInfo['OrderSub_Qty'] = value.cartCount,
          EShopOrderDetailsInfo['OrderSub_Wgt'] = 0,
          EShopOrderDetailsInfo['OrderSub_SelRate'] = value.newPrice - (value.newPrice * value.discount) / 100,
          EShopOrderDetailsInfo['OrderSub_BatchSlNo'] = 0,
          EShopOrderDetailsInfo['OrderSub_Amount'] = 0,
          EShopOrderDetailsInfo['OrderSub_TaxPers'] = 0,
          EShopOrderDetailsInfo['OrderSub_TaxAmt'] = 0;
        // value.id,value.name,value.cartCount,value.newPrice;
        jsonObj.push(EShopOrderDetailsInfo);
      }
    });


    EShopOrderMainInfo['ListEShopOrderDetailsInfo'] = jsonObj;
    let body = JSON.stringify(EShopOrderMainInfo);

    this.appService.post('OnlineShopV1/EShopOrderDetails_Insert', body)
      .toPromise().then(data => {
        var result = data;
        this.OrderId = result;
        this._localStorage.removeItem("sessionOrderMainId");
        this._localStorage.removeItem("sessionUniqueId");
        this.loading = false;
        this.appService.snackBar.open('Order confirmed', 'Success!!',
          { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center' })
        this.fnSmsSendForCustomer();
        this.horizontalStepper._steps.forEach(step => step.editable = false);
        this.verticalStepper._steps.forEach(step => step.editable = false);
        this.confirmorder = true;
        setTimeout(() => {
          this.horizontalStepper.next();
          this.verticalStepper.next();
        }, 200);
        this.appService.Data.cartList.length = 0;
        this.appService.Data.totalPrice = 0;
        this.appService.Data.totalCartCount = 0;
      }).catch((_) => {
        this.appService.snackBar.open('Order confirmed', 'Failed!!', {
          duration: 2000, verticalPosition: 'top', horizontalPosition: 'center'
        })
        this.loading = false;
      })
    // }


  }

  async fnSmsSendForCustomer() {
    const object = this.shippingAddrForm.get('shippingAddrMethod').value;
    const custname = object.firstName;
    const phone =  object.phone;
    let Message = ' Thanks for shopping with us..!' + '. Dear ' + custname +
      ' Your order is confirmed with Price Of Rs ' + this.grandTotal + ' , and will be shipped shortly. Check your status here: TapTh.is/order-status ';
    let MessageCounterInfo = {};
    MessageCounterInfo['MessageTo'] = phone;
    MessageCounterInfo['Information'] = Message;
    MessageCounterInfo['StaffId'] = parseFloat(this.custToken || 0);
    MessageCounterInfo['BranchId'] = parseFloat(this.dSessionBranchId || 0);
    let body = JSON.stringify(MessageCounterInfo);
    await this.appService.post('CommonQuery/SmsSent', body).toPromise()
      .then(data => {
        this.fnSmsSnedForBranch();
      });
  }

  async fnSmsSnedForBranch() {
    const object = this.shippingAddrForm.get('shippingAddrMethod').value;
    const custname = object.firstName;
    const phone =  object.phone;
    let Message = 'Dear ' + this.branchName + ' You have a order from Mr ' + custname + ' The Order Id is ' + this.OrderId + ' With The Price of Rs '
      + this.grandTotal + ' The Customer Number is ' + phone + ' ...THANK YOU..! ';

    let MessageCounterInfo = {};
    MessageCounterInfo['MessageTo'] = this.BranchMobileNo;
    MessageCounterInfo['Information'] = Message;
    MessageCounterInfo['StaffId'] = parseFloat(this.custToken || 0);
    MessageCounterInfo['BranchId'] = parseFloat(this.dSessionBranchId || 0);
    let body = JSON.stringify(MessageCounterInfo);
    await this.appService.post('CommonQuery/SmsSent', body).toPromise()
      .then(data => {

      });
  }

  fnselectBranch() {
    let strQuery = 'select * from Branch where BranchId =' + this.dSessionBranchId;;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(result => {
        var data = result;
        let obj = JSON.parse(data.JsonDetails[0])
        this.BranchMobileNo = obj[0].MobileNo;
        this.branchName = obj[0].BranchName;
      }
      ).finally(() => {
        this.fnAcidisValid();
      })
  }

  fnAcidisValid() {
    this.shippingArray = [];
    let strQuery = `select * from Customer where ACId = ${this.custToken}`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(data => {
        let IssueRouteHeadList = JSON.parse(data.JsonDetails[0]);
        if (IssueRouteHeadList.length !== 0) {
          const x = IssueRouteHeadList[0];

          let obj = {
            id: 0, firstName: x.CustName, middleName: '', email: x.Mail,
            lastName: x.LastName, address1: x.Address, address2: x.Address1,
            address3: x.CurrentLocationLat, phone: x.Phone1, state: x.CurrentLocationLong, pincode: x.Alias,
            city: x.ContactPerson, billingDate: '', addressType: 'Home'
          }
          this.shippingArray = [obj];

        } else {
          if (this.appService.Data.UserDetails.length) {
            const x = this.appService.Data.UserDetails[0];
            let obj = {
              id: 0, firstName: x.AC_Name, middleName: '', email: x.Email,
              lastName: '', address1: x.Addr1, address2: x.Addr2,
              address3: x.Addr3, phone: x.Phone, state: '', pincode: x.Alias,
              city: '', billingDate: '', addressType: 'Home'
            }
            this.shippingArray = [obj];
          }
          // this.appService.Data.UserDetails.forEach(element => {

          // });

        }
        this.fnShippingAddressGet();

      }, error => console.error(error));

  }

  fnShippingAddressGet() {

    this.accountService.onShippingAddressGet(this.custToken)
      .toPromise().then(res => {
        let jsonArray = JSON.parse(res.JsonDetails[0]);
        if (jsonArray.length)
          jsonArray.map(x => {
            let obj = {
              id: x.ShippingDetails_Id, firstName: x.ShippingDetails_FirstName, middleName: x.ShippingDetails_MiddleName, email: x.ShippingDetails_EmailId,
              lastName: x.ShippingDetails_LastName, address1: x.ShippingDetails_Addr1, address2: x.ShippingDetails_Addr2,
              address3: x.ShippingDetails_Addr3, phone: x.ShippingDetails_PhoneNo, state: x.ShippingDetails_State, pincode: x.ShippingDetails_Pincode,
              city: x.ShippingDetails_City, billingDate: '', addressType: x.ShippingDetails_DeliveryPoint
            }
            this.shippingArray.push(obj);
          });
        this.shippingAddrForm = this.formBuilder.group({
          shippingAddrMethod: [this.shippingArray[0], Validators.required]
        });



      });
  }

  public selectionChange(event?: StepperSelectionEvent): void {
    const cartData = this.appService.Data.cartList;
    if (!cartData.length) {
      this.router.navigateByUrl('');
      return
    }
    let cusSddress = this.shippingAddrForm.get('shippingAddrMethod').value;
    if (!cusSddress.address1 || !cusSddress.city || !cusSddress.state || !cusSddress.pincode) {
            this.appService.snackBar.open('Please Change or Add Valid Address', 'Warnning',
        { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: 'error' });
      setTimeout(() => {
         this.router.navigate(['account/addresses'])
      }, 1500);
      return
    }



    if (event.selectedIndex == 0) return; // First step is still selected
    this.selectedIndex = event.selectedIndex;
    if (this.selectedIndex == 2) {
      this.confirmationModel = true;
    }
  }

  fncheck() {
    this.confirmationModel = false;
  }
}
