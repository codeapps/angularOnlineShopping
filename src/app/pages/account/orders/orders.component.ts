import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import * as _moment from 'moment';
import { defaultFormat as _rollupMoment } from 'moment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { OrderviewDialogueComponent } from './orderview-dialogue/orderview-dialogue.component';
import { OrderImageViewerComponent } from './order-image-viewer/order-image-viewer.component';
import { AccountsService, LocalStorageService } from 'src/app/services';
import { AlertModalComponent } from 'src/app/theme/components/alert-modal/alert-modal.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public neworders: any[] = [];
  public fromDate = new Date();
  public toDate = new Date();

  public MinDate = new Date();
  public MaxDate = new Date();
  private today = new Date();

  constructor(public datePipe: DatePipe, public dialog: MatDialog, public snackBar: MatSnackBar,
    private accountService: AccountsService, private _localStorage: LocalStorageService,
    private router: Router) { }

  ngOnInit() {
    const mm = this.today.getMonth();
    const yyyy = this.today.getFullYear();
    this.fromDate = new Date(yyyy, mm, 1);
    const chgFromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    const chgToDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    const dTempAcId = this._localStorage.getItem('CusEShopId');
    if (dTempAcId) {
      this.fnOrderDetailsGet(chgFromDate, chgToDate);;
    } else {
      this.snackBar.open('Please login after view orders..!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });

    }

  }

  DateChange() {

    const chgFromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    const chgToDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    const dTempAcId = this._localStorage.getItem('CusEShopId')
    if (dTempAcId) {
      this.fnOrderDetailsGet(chgFromDate, chgToDate)
    } else {
      this.snackBar.open('Please login after view orders..!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    }
  }

  openProductDialog(order) {

    let dialogRef = this.dialog.open(OrderDialogComponent, {
      data: order,
      panelClass: 'order-dialog'
    });
    dialogRef.afterClosed(),
      this.router.navigate(['/account/orders']);
  }

  vieworderlist(list): void {
    const dialogRef = this.dialog.open(OrderviewDialogueComponent, {
      // width: '700px',
      // height: '547px',
      data: list
    });
    dialogRef.afterClosed().subscribe(result => {
      this.DateChange();
    });
  }

  fnImageViewer(order) {
    const dialogRef = this.dialog.open(OrderImageViewerComponent, {
      width: '1000px',
      height: '700px',
      data: order
    });
    dialogRef.afterClosed().subscribe(result => {
      this.DateChange();
    });
  }

  onAlertDialogue(orderid, uniqueid) {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      // width: '250px',
      data: { header: 'Warning!!', message: 'Are you sure you want to cancel this Order.....?' },
      hasBackdrop: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fnCancelOrder(orderid, uniqueid);
      };
    });
  }

  fnCancelOrder(orderid, uniqueid) {

    let errmsg = "'Sorry..! The Order Cannot be Cancel after 30 Minutes'";
    let confirmmsg = errmsg.replace(/['"]+/g, '');
    let msg = "'Your order hasbeen cancelled...!'";
    this.accountService.onCanceledOrder(orderid, uniqueid)
      .toPromise().then(result => {
        const data = JSON.parse(result.JsonDetails[0]);
        console.log(data);
        if (data[0].Column1 == confirmmsg) {
          this.snackBar.open(confirmmsg, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
        else {
          this.snackBar.open(msg, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
        }
        this.DateChange();
      }, error => console.error(error));
  }

  fnOrderDetailsGet(FromDate, ToDate) {
    this.accountService.onOrderDetailsGet(FromDate, ToDate)
      .toPromise().then(data => {
        let jsonData = data;
        this.neworders = jsonData;
      });
  }

  fnDateConvert(date) {
    const data = date.split("T")
    const format = data[0].split("-").reverse().join("/");
    return format;
  }
}
