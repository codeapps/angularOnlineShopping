import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MatDialog } from '@angular/material';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { Data, AppService } from '../../app.service';
import { Product } from '../../app.models';

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss']
})
export class ProductsCarouselComponent implements OnInit, AfterViewInit {

  @Input('products') products: Array<Product> = [];
  public config: SwiperConfigInterface = {};
  constructor(public appService:AppService, public dialog: MatDialog,
     private router: Router, private cd: ChangeDetectorRef) {

      }

  ngOnInit() {
   }

  ngAfterViewInit() {
    this.config = {
      observer: false,
      slidesPerView: 6,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: false,
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2,
        },
        960: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 5,
        }
      }
    };
    setTimeout(() => {
      this.config.observer = true;
    },5000);
  }

  public openProductDialog(product) {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

}
