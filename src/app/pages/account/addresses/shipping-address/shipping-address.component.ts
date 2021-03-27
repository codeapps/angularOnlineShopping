import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { AccountsService } from 'src/app/services';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss']
})
export class ShippingAddressComponent implements OnInit {
  @Input('form') private form: any;
  @Output() emitButton: EventEmitter<any> = new EventEmitter();
  shippingForm: FormGroup;
  private acId: string = '';
  private shippingId: number = 0;
  loading: boolean = false;
  countries: any[] = [];
  constructor(private appService: AppService,public snackBar: MatSnackBar,
    private accountService: AccountsService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    // this.branchId = this.appService._localStorage.getItem('SessionBranchId');
    this.acId = this.appService._localStorage.getItem('CusEShopId');
    this.countries = this.appService.getCountries();
    this.shippingForm = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'middleName': '',
      'company': '',
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'phone': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[6-9]\\d{9}')])],
      'country': ['IN', Validators.required],
      'city': ['', Validators.required],
      'state': '',
      'zip': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      'address1': ['', Validators.required],
      'address2': ['', Validators.required],
      'address3': '',
      'deliveryPoint': 'home',
      'deliveryTime': '',
    });

    if (this.form.ShippingDetails_Id) {
      const object = this.form;
      this.shippingId = Number(object.ShippingDetails_Id);
      this.shippingForm.patchValue({
        firstName: object.ShippingDetails_FirstName, lastName: object.ShippingDetails_LastName,
        middleName: object.ShippingDetails_MiddleName, company: '', email: object.ShippingDetails_EmailId,
        phone: object.ShippingDetails_PhoneNo, country: 'IN',
        city: object.ShippingDetails_City, state: object.ShippingDetails_State, zip: object.ShippingDetails_Pincode,
        address1: object.ShippingDetails_Addr1, address2: object.ShippingDetails_Addr2,
        address3: object.ShippingDetails_Addr3, deliveryPoint: object.ShippingDetails_DeliveryPoint,
         deliveryTime: object.ShippingDetails_DeliveryTime
      })

    }

  }

  onAddressType(eve) {
    this.shippingForm.get('deliveryPoint').setValue(eve)
  }

  public onShippingFormSubmit(values: Object): void {

    const shippingId = this.shippingId;
    if (this.shippingForm.valid && !this.loading) {
      this.loading = true;
      this.accountService.onShippingInsertAndUpdate(values, this.acId, shippingId)
        .subscribe(res => {
        this.emitButton.emit();
        this.snackBar.open('Shipping address saved successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        this.loading = false;
        }, err => {
          this.loading = false;
        })

    }
  }
}
