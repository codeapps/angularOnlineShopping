import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Product } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { ProductDialogComponent } from '../products-carousel/product-dialog/product-dialog.component';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit, OnChanges {
  @Input('product') products: Array<Product> = [];
  @Input('pviewType') viewType: string;
  @Input('pviewCol') viewCol: number;
  @Input('ptype') type: boolean;

  constructor(public appService: AppService,
    private router: Router,
    public dialog: MatDialog) { }
  public count = 24;
  public page = 1;

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.type) {
      this.page = 1;
      this.count = 40;
    }
    else {
      this.count = 24;
    }
  }


  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);

  }


  public openProductDialog(product){
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

  showMore() {
    if (this.products.length > this.count) {
      this.count += 20;
    }
    if (this.products.length <= this.count)
      this.type = false;
  }
}
