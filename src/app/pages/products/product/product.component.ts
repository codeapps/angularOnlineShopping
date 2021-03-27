import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  AppService } from '../../../app.service';
import { SingleItem, Product } from '../../../app.models';
import { emailValidator } from '../../../theme/utils/app-validators';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { CategoryService, LocalStorageService, ProductsService, SpecificationService } from 'src/app/services';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('zoomViewer', {static:false}) zoomViewer;
  @ViewChild(SwiperDirective, {static:false}) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  // public product: Product;
  public product: SingleItem;
  public image: any;
  public zoomImage: any;
  public units: string = '';
  private sub: any;
  public form: FormGroup;
  public relatedProducts: Array<Product> = [];
  public specifications: any[] = [];

  categoryId: any;
  allImages: any[] = [];
  folder: string = '';

  constructor(public appService: AppService, private productService: ProductsService,
    private activatedRoute: ActivatedRoute, private specificService: SpecificationService,
    private categoryService: CategoryService,
    public dialog: MatDialog, public formBuilder: FormBuilder,
    private _localStorage: LocalStorageService) {
    this.appService.getImagePath.subscribe(res => {
      this.folder = res;
    });
     }

  ngOnInit() {


    this.sub = this.activatedRoute.params.subscribe(params => {

      this.getProductforSpecification(params['id']);

    });


    this.form = this.formBuilder.group({
      'review': [null, Validators.required],
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    });


  }

  ngAfterViewInit() {
    this.config = {
      a11y: true,
      observer: false,
       direction: 'vertical',
      slidesPerView: 5,
      spaceBetween: 10,
      keyboard: true,
      navigation: true,
      pagination: false,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 3,
          direction: 'horizontal',
        },
        600: {
          slidesPerView: 3,
          direction: 'horizontal',
        },800: {
          slidesPerView: 4,
          direction: 'horizontal',
        }
      }
    };
  }

  getImageGets(id) {
    this.productService.fnSubImageGetOnProductId(id)
      .toPromise().then(data => {
        let jsonData = data.JsonDetails;
        this.allImages = JSON.parse(jsonData);
        this.allImages.map(x => {
          x.ProductSubImage = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${x.ProductSubImage}`;
        })

        setTimeout(() => {
          this.config.observer = true;
        }, 1000);
      }).finally(() => {
        this.getRelatedProducts(id);
      });
  }

  public getProductById(id) {

    let branchId = this._localStorage.getItem('SessionBranchId');
    if (branchId == null) {
      branchId = '0';
    }

    this.productService.onProductById(id, branchId)
      .toPromise().then(data => {
        let result = data;
        let jsonSingle = JSON.parse(result.JsonDetails);

        let objSingle:SingleItem;

        this.getImageGets(id);
        for (const single of jsonSingle) {
          let image = 'assets/images/placeholder/download.png';
          if (single.ImageLoc && this.folder) {
            image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${single.ImageLoc}`;
          }
          const cartItems = this.appService.Data.cartList;
          let cartCount = 0;
          if (cartItems.length) {
           let items = cartItems.find(x => id == x.id)
            if (items)
              cartCount = items.cartCount;
          }

          this.categoryId = single.categoryId;
          objSingle = new SingleItem(
            single.ProductId,
            single.ItemDesc,
            [
              {small: image, medium: image, big: image}
            ],
            single.MRP,
            single.SelRate,
            single.ProductId,
            parseFloat(single.Discount || 0),
            single.ProductId,
            single.ProductId,
            single.ProdSpecification,
            this.specifications.length ? this.specifications[0].FullItemDesc: '',
            parseFloat(single.BalanceQty || 0),
            cartCount,
            single.ProductId,
            single.ProductId,
            single.ProductId,
            single.categoryId
          );
          this.product = objSingle;
        }


        this.image = this.product.images[0].medium;
        this.zoomImage = this.product.images[0].big;
        //  setTimeout(() => {
        //        this.config.observer = true;
        // });
      }, err => console.error(err));
  }

  public getProductforSpecification(dProductId) {
    let branchId = this._localStorage.getItem("SessionBranchId");
    if (branchId == null) {
      branchId = '0';
    }

    this.specificService.onSpecificationByProdId(dProductId, branchId)
      .toPromise().then(data =>{
        this.specifications = data;
      }).finally(() => {
        this.getProductById(dProductId);

      })

  }

  public getRelatedProducts(dProductId) {
    let priceMenuId = '0';
    this.relatedProducts = [];
    let localStrPrice = this._localStorage.getItem('SessionPriceMenuId');

    if (localStrPrice)
      priceMenuId = localStrPrice;

    this.productService.onRelativeProducts(dProductId,priceMenuId)
      .toPromise().then(data => {
        let jsonproducts = data;
        for (const product of jsonproducts) {
          let images = 'assets/images/placeholder/related.png';
          if (product.ImageLoc && this.folder) {
            images = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${product.ImageLoc}`;

          }

          let prodmObj = new Product(

            product.ProductId,
            product.ItemDesc,
            [
              { small: images, medium: images, big: images }
            ],
            product.MRP,
            product.SelRate,
            product.ProductId,
            product.Discount,
            product.ProductId,
            product.ProductId,
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut congue eleifend nulla vel rutrum. Donec tempus metus non erat vehicula, vel hendrerit sem interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.',
            product.BalanceQty,
            0,
            product.ProductId,
            product.ProductId,
            product.ProductId,
            this.categoryId,
            product.SpecificationMain_Id,
            product.Manufacture_Id
          );
          this.relatedProducts.push(prodmObj);

        }

      }).finally(() => {
        this.categoryService.onProductTypeIdInCategory(this.specifications[0].PackType)
          .toPromise().then(res => {
            let dataItems = JSON.parse(res.JsonDetails);
            if(dataItems.length)
              this.units = dataItems[0].CategoryDesc

        })
      })

    // this.appService.getProducts('related').subscribe(data => {
    // this.relatedProducts = data;
    // });
  }

  public selectImage(images) {
    this.image = images;
    this.zoomImage = images;
  }

  public onMouseMove(e) {
    if (window.innerWidth >= 1280) {
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX / image.offsetWidth * 100;
      y = offsetY / image.offsetHeight * 100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if (zoomer) {
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = 'block';
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  public onMouseLeave(event) {
    this.zoomViewer.nativeElement.children[0].style.display = 'none';
  }

  public openZoomViewer() {
    this.dialog.open(ProductZoomComponent, {
      data: this.zoomImage,
      panelClass: 'zoom-dialog'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit(values: Object): void {
    if (this.form.valid) {
      // email sent
    }
  }


}
