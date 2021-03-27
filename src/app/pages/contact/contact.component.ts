import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  sessionWebBranchId: any = '';
  branchList: any = [];
  constructor(public formBuilder: FormBuilder,
    public _appService: AppService,
     _localStorage: LocalStorageService) {
      this.sessionWebBranchId = _localStorage.getItem("SessionBranchIdWeb");
    }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
    this.fngetContactBranch();
  }

  public onContactFormSubmit(values: Object): void {
    if (this.contactForm.valid) {

    }
  }
  fngetContactBranch() {
    let strQuery = ""
    if (this.sessionWebBranchId == 0) {
      strQuery = `select top 1 Branch * from Branch`;
    } else {
      strQuery = `select * from Branch Where BranchId = ${this.sessionWebBranchId}`;
    }

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {

        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.branchList = jsonData;
      }, error => (console.error(error)));
  }
}
