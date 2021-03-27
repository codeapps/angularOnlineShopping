import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { CategoryService } from 'src/app/services';
import { SidenavMenu } from '../sidenav-menu/sidenav-menu.model';
import { SidenavMenuService } from '../sidenav-menu/sidenav-menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  items = [];
  Categoryitem = [];
  Categorylist = [];
  JsonProductMain: any;
  JsonCategoryHead: any;
  JsonSubCategories: any;
  text: any = "water";
  states: string[] = [
    'English', 'Malayalam', 'Tamil', 'Hindi'
  ];

  tmpCategoryitem = [];
  constructor(public appService: AppService,private sidenavMenuService: SidenavMenuService, private categoryService: CategoryService) {

  }


  ngOnInit() {

    this.appService.assignBranchId.subscribe(res => {
      if (res)
        this.fngetProductTypewithBranchId(res);
    });


  }

  ngAfterViewInit(): void {

  }

  async fnProductTypeFill() {

    let dProductTypeId = "0";

    dProductTypeId = "1";

    let ServiceParams = {};
    ServiceParams['strProc'] = 'ProductTypeandCategoriesGets';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'ProductSpecification';
    ProcParams['strArgmt'] = dProductTypeId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post(`CommonQuery/fnGetDataReportReturnMultiTable`, body).subscribe(data => {
      let dataReport = data;
      this.items = (JSON.parse(dataReport.JsonDetails[0]));
      this.tmpCategoryitem = (JSON.parse(dataReport.JsonDetails[1]));
      this.Categorylist = (JSON.parse(dataReport.JsonDetails[2]));
      this.appService.Data.CategoryLists = this.Categorylist;
      const display = document.getElementById('preloader') as HTMLDivElement;
      display.style.display = 'none';
    }, error => console.error(error))
    // }, error => console.error(error));
  }

  fngetProductTypewithBranchId(val) {
    let branchId = parseFloat(val || 0)
    if (!branchId) { this.fnProductTypeFill(); return};
    this.categoryService.ongetProductTypewithBranchId(val)
      .toPromise().then(data => {
        let dataReport: any = data;
        if (!dataReport) {
          return
        }
      this.items = JSON.parse(dataReport.JsonDetails[0]);
      this.tmpCategoryitem = JSON.parse(dataReport.JsonDetails[1]);
      this.Categorylist = JSON.parse(dataReport.JsonDetails[2]);

        let sideMenuItems = [new SidenavMenu(1, 'Home', '/', null, null, false, 0, 0, '')];
        this.items.map(x => {
          sideMenuItems.push(new SidenavMenu(x.ProductType_Id, x.ProductType_Name, null, null, null, true, 0, 0, ''));
        });

        this.tmpCategoryitem.map(y => {
          sideMenuItems.push(new SidenavMenu(y.CategoryHead_Id + 100, y.CategoryHead_Name, null, null, null, true, y.ProductType_Id, 0, y.CategoryHead_ImageLoc));
        });

        this.Categorylist.map(z => {
          let typeId = 0;
          const filterTypeId = this.tmpCategoryitem.find(a => z.CategoryHead_Id == a.CategoryHead_Id);
          if (filterTypeId) typeId = filterTypeId.ProductType_Id;
            sideMenuItems.push(new SidenavMenu(z.CategoryID, z.CategoryDesc, `/products`, null, null, false, z.CategoryHead_Id + 100, typeId, ''))
        });

        // console.log(this.items);
        // console.log(this.tmpCategoryitem);
        // console.log(this.Categorylist);

         setTimeout(() => {
          this.sidenavMenuService.setSideMenu(sideMenuItems);
         });


      this.appService.Data.CategoryLists = this.Categorylist;
      setTimeout(() => {
        const display = document.getElementById('preloader') as HTMLDivElement;
        display.style.display = 'none';
      });
    });
  }

  tmpProdid = null;
  openMegaMenu(id) {
    this.Categoryitem = this.tmpCategoryitem.filter(a => a.ProductType_Id == id);
    // let pane = document.getElementsByClassName('cdk-overlay-pane');
    // [].forEach.call(pane, function (el) {
    //     if(el.children.length > 0) {
    //       if(el.children[0].classList.contains('mega-menu')) {
    //         el.classList.add('mega-menu-pane');
    //       }
    //     }
    // });

    if (this.tmpProdid == id) {
      this.tmpProdid = null;
    } else {
      this.tmpProdid = id;
    }
  }


}
