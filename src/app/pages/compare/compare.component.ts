import { Component, OnInit,Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Data, AppService } from '../../app.service';
import { Product, CartItem } from '../../app.models';
import { CartService } from 'src/app/services';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  @Input() product: Product;
  AcId: any;

  constructor(public appService: AppService,
    public snackBar: MatSnackBar, private cartService: CartService) { }

  ngOnInit() {
    this.appService.Data.cartList.forEach(cartProduct=> {
      this.appService.Data.compareList.forEach(product=> {
        if(cartProduct.id == product.id) {
          product.cartCount = cartProduct.cartCount;
        }
      });
    });
  }

  public remove(product:Product) {
      const index: number = this.appService.Data.compareList.indexOf(product);
      if (index !== -1) {
          this.appService.Data.compareList.splice(index, 1);
      }
  }

  public clear() {
    this.appService.Data.compareList.length = 0;
  }

  public addToCart(product:CartItem) {
    product.cartCount = product.cartCount + 1;
    if(product.cartCount <= product.availibilityCount) {
      this.cartService.addToCart(product);
    } else {
      product.cartCount = product.availibilityCount;
      this.snackBar.open('You can not add more items than available. In stock ' + product.availibilityCount + ' items and you already added ' + product.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    }
  }

}
