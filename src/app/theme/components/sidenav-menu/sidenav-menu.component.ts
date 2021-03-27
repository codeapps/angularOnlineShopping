import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SidenavMenuService } from './sidenav-menu.service';
import { SidenavMenu } from './sidenav-menu.model';
import { AppService } from 'src/app/app.service';
import { CategoryService } from 'src/app/services';


@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss'],
  providers: [SidenavMenuService]
})
export class SidenavMenuComponent implements OnInit,OnChanges {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  parentMenu:Array<any>;

  constructor(private sidenavMenuService: SidenavMenuService) { }

  ngOnInit() {

  }

  ngOnChanges(): void {
    this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
  }

  onClick(menuId){
    this.sidenavMenuService.toggleMenuItem(menuId);
    this.sidenavMenuService.closeOtherSubMenus(this.menuItems, menuId);
  }



  fnProductTypeFill() {

  }
}
