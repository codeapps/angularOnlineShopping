import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Data, AppService } from '../../app.service';
import { Product, CartItem } from '../../app.models';
import { CartService, WishlistService } from 'src/app/services';



@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  @Input() product: Product;
  @Input() type: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  public count = 1;
  public align = 'center center';

  public color = [];
  public qtyFlag: boolean = false;
  jsonCart: any;
  cartControl = false;
  constructor(public appService: AppService,
    private cartService: CartService,
    private wishService: WishlistService,
    public snackBar: MatSnackBar) {

    let controlview = sessionStorage.getItem('controlview');
    if (!controlview)
      this.fnSettings();
    else this.onControlview(controlview)
  }




  ngOnInit() {

    setTimeout(() => {
      this.onchangesproduct();
    });

    this.layoutAlign();

  }

  ngOnChanges(): void {
    setTimeout(() => {
      this.onchangesproduct();
    });
    this.fnwishlistPresent();
  }

  onchangesproduct() {
    if (this.product) {
      if (this.product.cartCount > 0) {
        this.count = this.product.cartCount;
      }


      this.cartService.subjcartItems.subscribe(cart => {
        this.jsonCart = cart;
        let isCart = this.jsonCart.find(x => x.id == this.product.id)
        if (isCart) {
          this.qtyFlag = true;
        } else {
          this.qtyFlag = false;
        }
      })
    }

  }

  fnSettings() {
    this.appService.onSettings('ShoppingControlView')
      .subscribe(res => {
        let keyValue = JSON.parse(res.JsonDetails[0]);
        if (keyValue.length) {
          sessionStorage.setItem('controlview', keyValue[0].Value);
          this.onControlview(keyValue[0].Value);
        }
      });
  }

  onControlview(value) {
    if (value == "Yes") {
      this.cartControl = true;
    }
  }

  public layoutAlign() {
    if (this.type === 'all') {
      this.align = 'space-between center';
    } else if (this.type === 'wish') {
      this.align = 'start center';
    } else {
      this.align = 'center center';
    }
  }




  public increment(product: CartItem) {
    let currentProduct = this.appService.Data.cartList.filter(item => item.id === product.id)[0];
    if (currentProduct || this.type == 'wish') {
      // if (this.count < this.product.availibilityCount) {
      this.count ++;
      if (this.type != 'wish')
        product.cartCount = this.count;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * (this.product.newPrice - (this.product.newPrice * this.product.discount) / 100)
      };

      this.changeQuantity(obj);
      // } else {
      //   this.snackBar.open('You can not choose more items than available. In stock ' + this.count + ' items.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      //   return false;
      // }
    } else {
      product.cartCount = this.count;
    }
    if (this.type != 'wish')
      this.cartService.addToCart(product);

  }

  public decrement(product: CartItem) {
    if (this.count == 1) {
      let isCart = this.jsonCart.find(x => x.id == this.product.id)
      if (isCart) {
        this.fnCartRemove(isCart);
      }
    }
    if (this.count > 1) {
      this.count--;
      let obj = {
        productId: this.product.id,
        soldQuantity: this.count,
        total: this.count * (this.product.newPrice - (this.product.newPrice * this.product.discount) / 100)
      };
      if (this.type != 'wish') {
        product.cartCount = this.count
        this.cartService.addToCart(product);
      }
      this.changeQuantity(obj);
    }


  }

  fnCartRemove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    this.cartService.fnRemoveCart(product)
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);

      if (this.appService.Data.cartList.length) {
        this.appService.Data.cartList.forEach(CartItem => {
          this.appService.Data.totalPrice = this.appService.Data.totalPrice + (CartItem.cartCount * (CartItem.newPrice - (CartItem.newPrice * CartItem.discount) / 100));
          this.appService.Data.totalCartCount = this.appService.Data.cartList.length;
        });
      } else {
        this.appService.Data.totalPrice = 0;
        this.appService.Data.totalCartCount = 0;
      }
      this.cartService.updateCart(this.appService.Data.cartList);
    }
  }

  public addToCompare(product: Product) {
    this.appService.addToCompare(product);
  }

  public addToWishList(product: CartItem) {

    if (!this.color[product.id]) {
      this.wishService.addToWishList(product);
      this.fnwishlistPresent()
    } else {
      this.wishService.fnRemoveWish(product);
      // const wish = this.appService.Data.wishList.find(x => x.id == product.id);
      // const index: number = this.appService.Data.wishList.indexOf(wish);
      // if (index !== -1) {
      //   this.appService.Data.wishList.splice(index, 1);
      // }
      this.color[product.id] = '';

    }



  }

  fnwishlistPresent() {
  this.appService.Data.wishList.map(data => {
      let x = data.id;
      this.color[x] = 'warn';
    });



  }

  public addToCart(product: CartItem) {
    let currentProduct = this.appService.Data.cartList.filter(item => item.id === product.id)[0];

    if (currentProduct) {
      if ((currentProduct.cartCount + this.count) <= this.product.availibilityCount) {
        product.cartCount = currentProduct.cartCount + this.count;
      } else {
        this.snackBar.open('You can not add more items than available. In stock ' + this.product.availibilityCount + ' items and you already added ' + currentProduct.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return false;
      }
    } else {
      product.cartCount = this.count;
    }
    this.cartService.addToCart(product);

  }

  public openProductDialog(event) {
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }

}
