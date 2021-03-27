import { Component, OnInit, HostListener, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../app.service';
import { Category } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { CartService, LocalStorageService } from '../services';
import { MatDialog } from '@angular/material';
import { AlertModalComponent } from '../theme/components/alert-modal/alert-modal.component';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [SidenavMenuService],

})

export class PagesComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('newSearch', { static: false }) newSearch: ElementRef;
  @ViewChild('mobSearch', { static: false }) mobSearch: ElementRef;


  public showBackToTop = false;
  public categories: Category[];
  public category: any;
  public CategoryHeads: any;
  public sidenavMenuItems: Array<any>;
  private jsonCategory: any;
  private scrollevent: any;
  public settings: Settings;
  public custTokenId:any;
  public scrollFix: boolean;
  public branchName: any;


  constructor(public appSettings: AppSettings,
    public appService: AppService,
    public sidenavMenuService: SidenavMenuService,
    private router: Router,
    private dialogue: MatDialog,
    private cartService: CartService,
    private _localStorage: LocalStorageService) {
    this.settings = this.appSettings.settings;
    this.custTokenId = this._localStorage.getItem('CusEShopId');
    this.appService.assignAcIdId.subscribe(res => {
        this.custTokenId = res;
      })
  }

   ngOnInit() {
    //  this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
     this.sidenavMenuService.getSidenavMenuItems().subscribe(res => {
       this.sidenavMenuItems = res;
     })
     this.appService.assignBranchId.subscribe(res => {
      this.fngetAllBranch(res);
     })


  }

  ngAfterViewInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.onTop();
        // newSearch.value
        this.sidenav.close();
        if(this.newSearch)
          this.newSearch.nativeElement.value = '';
        if(this.mobSearch)
        this.mobSearch.nativeElement.value = '';

      }
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuItems);

  }


  fnCategoryIdGetProducts(Id, keyword) {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Product_GetsOnCategoryIdOnEShop';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'CategoryId';
    ProcParams['strArgmt'] = Id;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Search';
    ProcParams['strArgmt'] = keyword;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportNew', body)
      .map((response) => response);
  }

  public getCategories() {

    this.CategoryHeads = this.appService.Data.categories;
    this.category = this.appService.Data.categories[0];
    if (this.category) {
      let itemList = this.appService.Data.CategoryLists.filter(value => value.CategoryHead_Id == this.category.id);
      this.appService.Data.CategoryLists = itemList;
    }

    this.appService.Data.categoryHead = this.CategoryHeads;

  }


  public remove(product) {

    const index: number = this.appService.Data.cartList.indexOf(product);
    this.cartService.fnRemoveCart(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice * product.cartCount;
      this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
      this.appService.resetProductCartCount(product);
    }
  }

  alertCart() {
    const dialogRef = this.dialogue.open(AlertModalComponent, {
      data: { header: `Are you sure !!`, message: 'Would you like to remove these items from the shopping cart?' },
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(result => result ? this.clear(): '');
  }

  public clear() {
    this.cartService.fnRemoveAllCart();
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }


  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public search() {

  }


  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => { window.scrollTo(0, 0); });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
  }



  onScroll(event) {
    (event.target.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
    this.scrollevent = event
  }

  onTop() {
    var scrollDuration = 200;
    if (this.scrollevent && this.scrollevent.target) {
      var scrollStep = -this.scrollevent.target.scrollTop / (scrollDuration / 20);
      var scrollInterval = setInterval(() => {
        if (this.scrollevent.target.scrollTop != 0) {
          this.scrollevent.target.scrollTop = scrollStep
        } else {
          clearInterval(scrollInterval);
        }


      }, 10)
    }

  }

  @HostListener('window:scroll', ['$event'])
  bodyOnScroll(e) {

    if (window.pageYOffset > 200) {
      this.scrollFix = true;
    } else {
      this.scrollFix = false;
    }
  }

  public closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }

  fngetAllBranch(id) {
    this.appService.fnCategoryHead()
    .toPromise().then(data => {
    let _data:any = data;
      this.jsonCategory = JSON.parse(_data);
      this.jsonCategory.forEach(element => {
        let catogoryObj = new Category(
          element.CategoryHead_Id,
          element.CategoryHead_Name,
          element.CategoryHead_Description,
          element.ProductType_Id
        );
        this.appService.Data.categories.push(catogoryObj);
      });
    }).finally(() => {
      this.appService.getBranch(id).toPromise()
      .then(data => {
        let _data: any = data;
        let jsonData = JSON.parse(_data.JsonDetails[0]);
        if(jsonData.length)
          this.branchName = jsonData[0].BranchName;

      }).finally(() => {
        this.getCategories();
      })

  })


  }

  fnGotoLogin() {
    this.router.navigate(['/sign-in']);
  }


}
