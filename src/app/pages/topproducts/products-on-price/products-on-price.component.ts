import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-on-price',
  templateUrl: './products-on-price.component.html',
  styleUrls: ['./products-on-price.component.scss']
})
export class ProductsOnPriceComponent implements OnInit {
  imageLists: any;
  imgFolder: string = '';
  offerBanner = {
    banner1: '', banner2: '', banner3: ''
  }

  constructor(public _appService: AppService) { }

  ngOnInit() {

    this._appService.getImagePath.subscribe(res => {
      if (res) {
        this.imgFolder = res;
        this.fnSettings();
      }

    });
  }

  fnSettings() {
    let strQuery = `select Value from Settings where KeyValue = 'OfferImages'`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      let _data:any = data
      let jsonData = JSON.parse(_data.JsonDetails[0]);
      const DataValues = jsonData[0].Value;
      const Data = DataValues.split(',');
      this.imageLists = Data;
      for (let index = 0; index < this.imageLists.length; index++) {
        this.imageLists[index] ='https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this.imgFolder + '/' + this.imageLists[index];
      }
      this.offerBanner = {banner1: this.imageLists[0], banner2: this.imageLists[1], banner3: this.imageLists[2]}

    });
  }


}
