import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services';
import { Data, AppService } from '../../app.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  total = [];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  Products: any = [];
  imageUrl = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480%20X%20360';
  constructor(public appService: AppService, private cartService: CartService) { }

  ngOnInit() {
    this.fnGetAllProducts();
    this.appService.Data.cartList.forEach(product => {
      this.total[product.id] = product.cartCount * (product.newPrice - (product.newPrice * product.discount) / 100);
      this.grandTotal += product.cartCount * (product.newPrice - (product.newPrice * product.discount) / 100);
      this.cartItemCount[product.id] = product.cartCount;
    });
  }

  public updateCart(value) {
    if (value) {
      this.total[value.productId] = value.total;
      this.cartItemCount[value.productId] = value.soldQuantity;
      this.grandTotal = 0;
      this.total.forEach(price => {
        this.grandTotal += price;
      });
      this.cartItemCountTotal = 0;
      this.cartItemCount.forEach(count => {
        this.cartItemCountTotal += count;
      });

      this.appService.Data.totalPrice = this.grandTotal;
      // this.appService.Data.totalCartCount = this.cartItemCountTotal;

      this.appService.Data.cartList.forEach(product => {
        this.cartItemCount.forEach((count, index) => {
          if (product.id == index) {
            product.cartCount = count;
          }
        });
      });

    }
  }

  public remove(product) {


    this.cartService.fnRemoveCart(product);
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.grandTotal = this.grandTotal - this.total[product.id];
      this.appService.Data.totalPrice = this.grandTotal;
      this.total.forEach(val => {
        if (val == this.total[product.id]) {
          this.total[product.id] = 0;
        }
      });

      this.cartItemCountTotal = this.cartItemCountTotal - this.cartItemCount[product.id];
      this.appService.Data.totalCartCount = this.cartItemCountTotal;
      this.cartItemCount.forEach(val => {
        if (val == this.cartItemCount[product.id]) {
          this.cartItemCount[product.id] = 0;
        }
      });
      this.appService.resetProductCartCount(product);
    }
  }

  public clear() {
    this.cartService.fnRemoveAllCart()
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }

  fnGetAllProducts() {
    let strQuery = `select * from Product`;
    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    this.appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(
      data => {
        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.Products = jsonData;
      }, error => (console.error(error)));
  }

  onImgError(event) {
    event.target.src = this.imageUrl;
  }
}
