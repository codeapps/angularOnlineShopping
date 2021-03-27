import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavMenuService } from 'src/app/theme/components/sidenav-menu/sidenav-menu.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {

  sessionWebBranchId: any = localStorage.getItem("SessionBranchIdWeb");
  constructor(private activatedRoute: ActivatedRoute,private sidenavMenuService: SidenavMenuService,
    public appService: AppService, public dialog: MatDialog, private router: Router) {
    this.appService.getImagePath.subscribe(data => {
      this.imagpath = data;

    })
  }

  public imagpath = '';

  public viewCol = 25;
  public counts = [15, 30, 45];
  public count: any;

  public sort: any;

  public categories: Array<any> = [];
  public page: any;

  tembBranchId: any;
  private sub: any;
  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      let paramId = params['id'];
      this.sidenavMenuService.getSidenavMenuItems()
        .subscribe(res => {
          const menuType = res;

          let categorySub = menuType.filter(x => x.parentId == paramId);

          this.categories = categorySub;
        });
    });
    this.tembBranchId = localStorage.getItem('SessionBranchId');
    if (this.tembBranchId == null) {
      this.tembBranchId = 0;
    }


    this.count = this.counts[0];

    if (window.innerWidth < 1280) {
      this.viewCol = 25;
    }

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fnchangeCategory(value) {
    let id = value - 100;
        this.router.navigate(['/categories-products', id]);
    // this.router.navigate(['/categories-products', value]);
  }

  public changeCount(count) {
    this.count = count;
    // this.getAllProducts();
  }


  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  getImage(img):any {
    let bgImage = {};
    if (!img) {
      bgImage = 'https://via.placeholder.com/300x250?text=300x250+MPU';

    } else {
      bgImage = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imagpath}/${img}`

    }
    return bgImage;
  }



  fngetCategoryName(name) {
    const Data = name.split("/");
    return Data;
  }
}
