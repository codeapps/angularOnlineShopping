import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { AppService } from './app.service';
import { ConnectionService } from 'ng-connection-service';
import { UserDetail } from './app.models';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material';
import { CartService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  public settings: Settings;
  public status: string = 'ONLINE';
  private isConnected: boolean = true;
  public setName: string = '';
  public setPassword: string = '';
  public settingsLogin: boolean = false;

  static isBrowser = new BehaviorSubject<boolean>(null);

  constructor(public appSettings: AppSettings, private _snackBar: MatSnackBar,
    public appService: AppService, @Inject(PLATFORM_ID) platformId: any,
    public router: Router, private connectionService: ConnectionService,
    private cartService: CartService) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    this.settings = this.appSettings.settings;

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
        this.router.navigate(['/']);
      } else {
        this.status = 'OFFLINE';
        this.router.navigate(['offline']);
      }
    });
  }

  ngOnInit() {
    let dTempAcId = this.appService._localStorage.getItem('CusEShopId');
    let branchId = this.appService._localStorage.getItem("SessionBranchIdWeb");
    if (dTempAcId) this.appService.onLogin(dTempAcId);
    else this.appService.onLogin(0);
    if (!branchId) this.fnSettings();
    else {
      this.appService.setAssignBranchId(branchId);
      this.onThemeColor();
    };

    this.appService._localStorage.removeItem("sessionOrderMainId");
    this.appService._localStorage.removeItem("sessionUniqueId");

  }


  ngAfterViewInit() {

    // let dTempAcId = this.appService._localStorage.getItem('CusEShopId');
    this.appService.assignAcIdId
      .subscribe(res => {
        let dTempAcId = parseFloat(res);

        if (dTempAcId) {
          this.appService.fnUserName(dTempAcId).toPromise()
            .then(data => {
              const jsonUser: any = data;
              if (jsonUser == '') { return; }

              const BranchId = jsonUser[0].BranchId;
              this.appService._localStorage.setItem('BranchId', BranchId);

              let objUser;
              let book = null;

              for (var i = 0; i < jsonUser.length; i++) {
                objUser = new UserDetail(
                  jsonUser[i].AC_Id,
                  jsonUser[i].AC_Name,
                  jsonUser[i].Addr1,
                  jsonUser[i].Addr2,
                  jsonUser[i].Addr3,
                  jsonUser[i].Phone,
                  jsonUser[i].Email,
                  jsonUser[i].Alias,
                  jsonUser[i].ExpiryDate,
                  jsonUser[i].BranchId

                );
                this.appService.Data.UserDetails.push(objUser);
              }
            }).finally(() => {
               this.cartService.fnGetCartListOnAcId(dTempAcId);
            })

        }
    })

  }

  fnSettings() {

    this.appService.onSettings('OrderBasedOnPincode')
      .toPromise().then(data => {
        let jsonData: any = data;
        let jsonObj = JSON.parse(jsonData.JsonDetails[0]);
        if (jsonObj[0].Value == 'No') {
          this.appService.onOrderWebAddressBranch()
            .toPromise().then(res => {
              let jsonObj = JSON.parse(res.JsonDetails[0]);
              let jsonWeb = this.appService.onFindUrlValidate(jsonObj);
              if (jsonWeb) {
                this.appService.setAssignBranchId(jsonWeb.BranchId);
              } else {
                this.appService.setAssignBranchId('0');
              }
            })
        } else {
          this.appService.setAssignBranchId('0');
        }

      }).finally(() => {
        this.onThemeColor();
      })
  }

  onThemeColor() {
    this.appService.onSettings('SColor')
        .toPromise().then(data => {
          let jsonData: any = data;
          let jsonObj = JSON.parse(jsonData.JsonDetails[0]);
          if (jsonObj.length) {
            this.settings.theme = jsonObj[0].Value;
          }

        });
  }

  fnLogin() {
    if (!this.setName) {
      this.openSnackBar('Enter User Name !!', 'Error');
      return;
    }
    if (!this.setPassword) {
      this.openSnackBar('Enter Password !!', 'Error');
      return;
    }
    if (this.setName == 'codeapps' && this.setPassword == 'code123') {
      this.openSnackBar('Login verified', 'Sucessfully');
      this.router.navigateByUrl("/admin");
      this.settingsLogin = false;
    } else {
      this.openSnackBar('Enter valid Username or Password', 'Error');
    }
  }

  fnClose() {
    this.setName = '';
    this.setPassword = '';
    this.settingsLogin = false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {

    if (event.ctrlKey && event.altKey && event.keyCode == 90) {
      this.settingsLogin = true;
      setTimeout(() => {
        let _docEle = document.getElementById('txtsetname') as HTMLInputElement;
        if (_docEle)
          _docEle.focus();
      }, 100);
    }
  }
}
