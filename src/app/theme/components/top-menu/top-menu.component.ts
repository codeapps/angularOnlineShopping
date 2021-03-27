import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit {
  UserType: any;

  constructor(public appService:AppService) {

   }
  public currencies = ['INR','USD', 'EUR'];
  public currency:any;
  AcId = null;
  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  public flags = [
    { name:'English', image: 'assets/images/flags/gb.svg' },
    { name:'German', image: 'assets/images/flags/de.svg' },
    { name:'French', image: 'assets/images/flags/fr.svg' },
    { name:'Russian', image: 'assets/images/flags/ru.svg' },
    { name:'Turkish', image: 'assets/images/flags/tr.svg' }
  ];
  public flag:any;

  ngOnInit() {
    this.AcId = this.appService.dTempAcId;
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
  }

  public changeCurrency(currency) {
    this.currency = currency;
  }

  public changeLang(flag) {
    this.flag = flag;
  }


}
