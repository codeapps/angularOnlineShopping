import { Wishlist } from './../../app.models';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Data, AppService } from '../../app.service';
import { Product, CartItem } from '../../app.models';
import { Router } from '@angular/router';
import { ProductDialogComponent } from 'src/app/shared/products-carousel/product-dialog/product-dialog.component';
import { CartService, CategoryService, LocalStorageService, WishlistService } from 'src/app/services';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  @Input() product: Product;
  public quantity = 1;

  public CategoryLists: any = [];
  public tempWishLists: Wishlist[];
  private BranchId = '';
  private AcId = '';
  public expand: boolean = false;
  public multiple: boolean = false;
  constructor(public appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router,
    private _localStorage: LocalStorageService,
    private categoryService: CategoryService,
    private wishService: WishlistService,
    private cartService: CartService,
    public dialog: MatDialog) {
      this.BranchId = _localStorage.getItem("SessionBranchId");
      this.AcId = _localStorage.getItem("CusEShopId");
    }

  ngOnInit() {
    this.tempWishLists = this.appService.Data.wishList;

    this.fnGetAllCategories();
    this.appService.Data.cartList.forEach(cartProduct => {
      this.appService.Data.wishList.forEach(product => {
        if (cartProduct.id == product.id) {
            product.cartCount = cartProduct.cartCount;
        }
      });
    });

  }

  public remove(product: Wishlist) {
    const index: number = this.appService.Data.wishList.indexOf(product);
    this.wishService.fnRemoveWish(product);
    if (index !== -1) {
      this.appService.Data.wishList.splice(index, 1);
    }
  }

  public clear() {
    if (!confirm('Do you want clear All WishList Items!!')) {
      return
    }
    this.wishService.fnRemoveAllWish();
    this.appService.Data.wishList.length = 0;
  }

  public getQuantity(val) {
    this.quantity = val.soldQuantity;
  }

  public addToCart(product: CartItem) {

    let currentProduct = this.appService.Data.cartList.find(item => item.id == product.id);

    if (currentProduct) {
      if ((this.quantity) <= product.availibilityCount) {
        product.cartCount = this.quantity;
      } else {
        this.snackBar.open('You can not add more items than available. In stock ' + product.availibilityCount + ' items and you already added ' + currentProduct.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return false;
      }
    } else {
      product.cartCount = this.quantity;
    }
    this.cartService.addToCart(product);

  }

  fnGetAllCategories() {
    this.categoryService.onGetAllCategory(this.BranchId, this.AcId)
      .subscribe(data => {
      let jsonData = JSON.parse(data.JsonDetails[0]);
      this.CategoryLists = jsonData;
    })
  }

  fnGroupedById = (val) => {
    const wishData = this.tempWishLists.filter(x => Number(x.categoryId) === val);
    return wishData;
  }
  public openProductDialog(product) {
    var productView = {
      ddlist: '',
      flag: false,
      duplicate: '',
      product: product
    }
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: productView,
      panelClass: 'product-dialog'
    });
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }


  fnChangeIcons(index){

  }
}
