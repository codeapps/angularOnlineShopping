import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.scss']
})
export class MainCarouselComponent implements OnInit, AfterViewInit {

  // public imagpath = 'SuperMarket';
  // sessionWebBranchId: any = localStorage.getItem("SessionBranchIdWeb");
  // @Input('slides') slides: Array<any> = [];
  public slides: any[] = []
  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  private folder: string = '';
  constructor(public appService: AppService) {
    this.appService.getImagePath.subscribe(data => {
      this.folder = data;
    })
  }

  ngOnInit() {
    this.appService.assignBranchId.subscribe(res => {
      if (res)
        this.fnGetHomeSlides(res);
      else
        this.fnGetHomeSlides(this.appService._localStorage.getItem("SessionBranchIdWeb"));
    });
  }

  ngAfterViewInit() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: false,
      preloadImages: true,
      updateOnImagesReady: false,
      observer: false,
      lazy: false,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 400,
      effect: 'slide' // slide
    };
  }

  public getBgImage(image) {
    return { 'background-image': `url(${image})` };

  }



  fnGetHomeSlides(val) {

    let strQuery = "select * from EShopHomeImage";
    if (val) {
      strQuery = "select * from EShopHomeImage Where BranchId =" + val;
    }
    this.slides = [];
    let objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(data => {
        const jsonObj = JSON.parse(data.JsonDetails);

        let items: any = [];
        if (jsonObj.length) {
          for (const main of jsonObj) {
            let images = 'assets/images/placeholder/banners.png';
            let eachItems = {};

            if (main.EShopHomePage_ImageName && this.folder) {
              images = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${main.EShopHomePage_ImageName}`;
            }
            eachItems["title"] = main.EShopHomePage_msg1;
            eachItems["subtitle"] = main.EShopHomePage_msg2;
            eachItems["Descriptions"] = main.EShopHomePage_msg3;
            eachItems["images"] = images;
            items.push(eachItems);
          }
        }
        this.slides = items;
        setTimeout(() => {

          this.config.observer = true;
        }, 100);
      });
  }

}
