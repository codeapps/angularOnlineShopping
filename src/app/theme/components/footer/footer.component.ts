import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public lat = 40.678178;
  public lng = -73.944158;
  public zoom = 12;

  branchList: any;
  branchName: any;
  branchAdd1: any;
  branchAdd2: any;
  branchPhone: any;
  branchEmail: any;
  constructor(public _appService: AppService,
    private _localStorage: LocalStorageService) { }

  ngOnInit() {
    this.fngetFooterBranch();
  }

  subscribe() { }

  fngetFooterBranch() {
    let strQuery = ""
    let id:any =  this._localStorage.getItem("SessionBranchIdWeb");;
    if (id == 0 || id == null) {
      strQuery = `select top 1 branch.* from Branch`;
    } else {
      strQuery = `select * from Branch Where BranchId = ${id}`;
    }

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {
        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.branchList = jsonData;
        this.branchName = this.branchList[0].BranchName;
        this.branchAdd1 = this.branchList[0].BranchAdr1;
        this.branchAdd2 = this.branchList[0].BranchAdr2;
        this.branchPhone = this.branchList[0].Phone;
        this.branchEmail = this.branchList[0].Mail
      }, error => (console.error(error)));
  }
}
