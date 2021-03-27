import { AppService } from './../../../app.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services';


@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {
  fromDate = new Date();
  toDate = new Date();
  maxDate = new Date();
  createFlag: boolean = true;
  sessionBranchId: any;
  branchId: any;
  CustomerList: any = [];
  tempChecklist: any = [];
  checkLists: any = [];
  constructor(public appService: AppService, private _localStorage: LocalStorageService) { }

  ngOnInit() {
    this.sessionBranchId = this._localStorage.getItem("SessionBranchIdWeb")
    if (this.sessionBranchId == 0) {
      this.fnGetBranchId();
    } else {
      this.branchId = this.sessionBranchId;
      this.fngetCustomer();
    }
  }

  fnGetBranchId() {
    let strQuery = `select * from Branch `;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);

    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data: any = data;
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.branchId = jsonData[0].BranchId;
      this.fngetCustomer();
    });
  }

  fngetCustomer() {
    let chngfromdate = "'" + this.ConvertDateAll(this.fromDate) + "'";
    let chngtodate = "'" + this.ConvertDateAll(this.toDate) + "'";

    let strQuery = `select distinct AcId,AccountHead.* from EShopOrderMain
    inner join AccountHead on AccountHead.AC_Id = EShopOrderMain.AcId
	where EShopOrderMain.BranchId = ${this.branchId} and EShopOrderMain.OrderType = 'Image' and
	EShopOrderMain.OrderMain_Date between ${chngfromdate} and ${chngtodate} and EShopOrderMain.OrderMain_Flag = 'Ordered'`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data:any = data
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.CustomerList = jsonData;
    });
  }

  fnViewClick(data) {
    this.createFlag = false
    let chngfromdate = "'" + this.ConvertDateAll(this.fromDate) + "'";
    let chngtodate = "'" + this.ConvertDateAll(this.toDate) + "'";

    let strQuery = `select  * from EShopOrderMain
    where BranchId = ${this.branchId} and AcId = ${data.AcId} and OrderMain_Date between ${chngfromdate} and ${chngtodate} and Order_Cancel = 0
  	and OrderType = 'Image' order by orderMain_Id desc`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data:any = data
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      this.tempChecklist = jsonData;
      for (let index = 0; index < this.tempChecklist.length; index++) {
        if (this.tempChecklist[index].OrderMainImageLoc == null || this.tempChecklist[index].OrderMainImageLoc == '') {
          this.tempChecklist[index].OrderMainImageLoc = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360';
        } else {
          this.tempChecklist[index].OrderMainImageLoc = 'https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this.appService.getImagePath + '/' + this.tempChecklist[index].OrderMainImageLoc;
        }
      }
      this.checkLists = this.tempChecklist
    });
  }

  fnBack() {
    this.createFlag = true;
    this.fngetCustomer();
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }

  fnSplitWhiteSpace(date) {
    const data = date.split(" ");
    return data[0]
  }
}
