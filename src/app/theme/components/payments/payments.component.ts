import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { AppService } from 'src/app/app.service';
import { WindowRefService } from 'src/app/services';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('rzp_test_6Kesmq0CZkOJoN' + ':' + 'u36I81eSsp8IGRPqynvkRwFN')
    // "Authorization": 'Basic ' + btoa('rzp_test_6Kesmq0CZkOJoN:u36I81eSsp8IGRPqynvkRwFN')
    // 'Authorization': 'rzp_test_6Kesmq0CZkOJoN;u36I81eSsp8IGRPqynvkRwFN'
  })
};

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [WindowRefService]
})

export class PaymentsComponent implements OnInit {
  @Input('total') total: number;
  @Input('userDetail') userDetail: any;

  public payPalConfig?: IPayPalConfig;
  constructor(private winRef: WindowRefService, private http: HttpClient) { }

  ngOnInit() {


    // this.initConfig();
  }

  createRzpayOrder(data) {

    // console.log(data);
    // call api to create order_id
    let total = Number(this.total);
    let params = {
      "amount": total * 100,
      "currency": "INR",
      "receipt": "receipt#1"
    }


    // this.http.get('https://api.razorpay.com/v1/orders/order_GRqSmjtz4qHVfp')
    //   .subscribe(res => {
    //   console.log(res);

    //   })
    // return
    let body = JSON.stringify(params)
    this.http.post('https://api.razorpay.com/v1/orders', body, httpOptions)
      .subscribe(res => {

    },err => console.error(err))
     this.payWithRazor('ID4654646');
  }

  payWithRazor(val) {
    const userField = this.userDetail.shippingAddrMethod;

    let total = Number(this.total);
    const options: any = {
      key: 'rzp_test_6Kesmq0CZkOJoN',
      amount: total * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'CodeApps', // company name or product name
      description: '',  // product description
      // image: './assets/logo.png', // company logo or product image
      // order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      "prefill": {
        "name": userField.firstName,
        "email": userField.email,
        "contact": userField.phone
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#689f38'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    //   document.getElementById('rzp-button1').onclick = function(e){
    //     rzp.open();
    //     e.preventDefault();
    //  }
    rzp.open();
  }

  private initConfig(): void {

    let total: string = '200';

    this.payPalConfig = {
      currency: 'INR',
      clientId: 'AXR9fqPnr9RIwnrpmGcDiAf8A7GYvv49vQ_7-0QgjnYKnoFFCSBF0YuN0E80ohn24cBPRvubbpej6xc4',

      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'INR',
            value: total,
            breakdown: {
              item_total: {
                currency_code: 'INR',
                value: total
              },
              shipping: {
                currency_code: 'INR',
                value: '0',
              }
            }
          },
          // items: cartItems,

        }],
        //   application_context: {
        //     locale: 'en_IN'
        // },
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        size: 'small',
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }
}
