import { AppService } from 'src/app/app.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent, SwiperConfigInterface } from 'ngx-swiper-wrapper';


@Component({
  selector: 'app-brands-carousel',
  templateUrl: './brands-carousel.component.html',
  styleUrls: ['./brands-carousel.component.scss']
})
export class BrandsCarouselComponent implements OnInit {

  @Input('brands') brands: Array<any> = [];
  // brands: any;
  public config: SwiperConfigInterface = {

  };

  constructor(public appService: AppService) {


  }

  ngOnInit() {


  }

  ngAfterViewInit() {
    this.config = {
      a11y: false,
      observer: true,
      slidesPerView: 7,
      spaceBetween: 16,
      keyboard: false,
      navigation: true,
      pagination: false,
      grabCursor: false,
      mousewheel: false,
      loop: true,

      preloadImages: true,
      lazy: false,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide",

      freeMode: true,
      updateOnImagesReady: true,

      breakpoints: {
        320: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        },
        960: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 5,
        },
        1500: {
          slidesPerView: 6,
        }
      }
    }

  }

}
