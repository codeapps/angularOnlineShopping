
import { UserDetail } from './../../../../app.models';
import { AppService } from './../../../../app.service';
import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import html2canvas from 'html2canvas';
import { AccountsService, LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDialogComponent implements OnInit {
  orders: any;
  userDetails: UserDetail;
  count;
  shippingcharge: any;
  finaltotal: any;
  dSessionBranchId = '';

  branchname: any;
  Branchaddress: string;
  MainOrder: any;


  constructor(public appService: AppService, public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public order: any, _localStorage: LocalStorageService,
    private accountService: AccountsService) {
      this.dSessionBranchId = _localStorage.getItem('BranchId');
     }

  ngOnInit() {
    this.accountService.onOrderDetailsGetonAcid(this.order)
      .toPromise().then(data => {
        this.orders = data;

      // this.shippingcharge = this.orders[0].OrderMain_ShippingChrge;
      // this.finaltotal = this.orders[0].OrderMain_Total;
      let counting = 0
      for (var i = 0; i <= this.orders.length; i++) {
        this.count = counting++
      }
      this.fngetmainOrder(this.order)
    });

    const UserInfo: UserDetail[] = this.appService.Data.UserDetails;
    this.userDetails = UserInfo[0];
    this.fnselectBranch();

  }
  fngetmainOrder(id){
       this.accountService.ongetmainOrder(id)
        .toPromise().then(data => {
        let result = data;
        this.MainOrder = JSON.parse(result.JsonDetails[0]);
        this.shippingcharge = this.MainOrder[0].OrderMain_ShippingChrge;
        this.finaltotal = this.MainOrder[0].OrderMain_Total;
        });
  }

  public close(): void {
    this.dialogRef.close();
  }

  fnselectBranch() {
    let strQuery = 'select * from Branch where BranchId =' + this.dSessionBranchId;;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      result => {
        var data:any = result;
        var obj = JSON.parse(data.JsonDetails);
        this.branchname = obj[0].BranchName;
        var branchadd1 = obj[0].BranchAdr1
        var branchadd2 = obj[0].BranchAdr2
        var branchadr3 = obj[0].BranchAdr3
        this.Branchaddress = (branchadd1+' '+ branchadd2+' '+ branchadr3);
      }
    );
  }

  getGrandTotal() {
    if (this.orders && this.orders.length) {
      return this.orders.map(data => parseFloat(data.OrderSub_Qty || 0) * parseFloat(data.OrderSub_SelRate || 0)).reduce((t, c) => (t + c));
    }
    return 0;
  }
  getTotal() {
    if (this.orders && this.orders.length) {
      return this.orders.map(data => parseFloat(data.OrderSub_SelRate || 0)).reduce((t, c) => (t + c));
    }
    return 0;
  }

  getTotalQty() {
    if (this.orders && this.orders.length) {
      return this.orders.map(data => parseFloat(data.OrderSub_Qty || 0)).reduce((t, c) => (t + c));
    }
    return 0;
  }

  captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf:any // = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('InvoiceBill.pdf'); // Generated PDF
    });
  }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('contentToConvert').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet" type="text/css" href="assets/css/print.css" />
        </head>
    <body onload="window.print();">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}

  fnSplitWhiteSpace(date) {
    const data = date.split(" ");
    return data[0]
  }
}
