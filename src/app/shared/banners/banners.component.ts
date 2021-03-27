import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { SidenavMenuService } from 'src/app/theme/components/sidenav-menu/sidenav-menu.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit, AfterViewInit {

  public config: SwiperConfigInterface = {
    a11y: false,
    direction: 'horizontal',
    slidesPerView: 3.2,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    // navigation: true,
    autoplay: false,
    observer: false,
    pagination: false,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-right',
      prevEl: '.swiper-button-left',
    },
    breakpoints: {
      480: {
        slidesPerView: 1
      },
      1200: {
        slidesPerView: 2.5,
      },
      800: {
        slidesPerView: 2,
      },
      600: {
        slidesPerView: 2,
      }
    }
  };

  public banners: Array<any> = [];
  folder: string = '';
  constructor(private router: Router, private sidenavMenuService: SidenavMenuService,
    public appService: AppService) {
      this.appService.getImagePath.subscribe(data => {
        this.folder = data;
      })
  }

  ngOnInit() {
    setTimeout(() => {
      this.sidenavMenuService.getSidenavMenuItems()
      .subscribe(res => {
        const menuType = res;

        let categoryMain = menuType.filter(x => {
          if (x.parentId == 0 && x.hasSubMenu) {
            return x.sub = menuType.filter(y => y.parentId == x.id);
          }
        });
        this.banners = categoryMain;
        setTimeout(() => {
          this.config.observer = true;
        }, 600);

      });
    }, 100);

   }

  ngAfterViewInit() {

  }

  public getBanner(index) {
    if (this.banners[index] == undefined) {
      let dataNull = {
        id: 0, title: 'Avilable soon', subtitle: 'New Arrivals On Sale',
        image: 'assets/images/placeholder/banners.png'
      };
      return dataNull;
    }
    return this.banners[index];
  }

  public getBgImage(img) {
    let bgImage = { 'background-image': 'url(assets/images/placeholder/banners.png )' };
    if (img && this.folder) {
      bgImage = { 'background-image': img != null ? `url(https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${img})` : 'url(assets/images/placeholder/banners.png)'};

    }
    return bgImage;
  }


  fnchangeCategory(value) {
    let id = value - 100;
        this.router.navigate(['/categories-products', id]);
  }
  fnNavigate(ev) {

    this.router.navigate(['/categories', ev.id]);
  }
}
