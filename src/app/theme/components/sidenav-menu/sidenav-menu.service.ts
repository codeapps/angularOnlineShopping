import { AppService } from './../../../app.service';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { SidenavMenu } from './sidenav-menu.model';
import { sidenavMenuItems } from './sidenav-menu';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class SidenavMenuService {

// public SideMenuItems:Array<SidenavMenu> = [];
  public sideMenuSubject$ = new BehaviorSubject<any[]>([]);

    constructor(private location:Location, public appservice:AppService) { }


    public getSidenavMenuItems() {

     return this.sideMenuSubject$.asObservable();
    }

  setSideMenu(obj) {
    this.sideMenuSubject$.next(obj)
  }

    public expandActiveSubMenu(menu:Array<SidenavMenu>){
      let url = this.location.path();
      let routerLink = decodeURIComponent(url);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
          let menuItem = activeMenuItem[0];
          while (menuItem.parentId != 0){
              let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
              menuItem = parentMenuItem;
              this.toggleMenuItem(menuItem.id);
          }
      }
  }

  public toggleMenuItem(menuId){
      let menuItem = document.getElementById('menu-item-'+menuId);
      let subMenu = document.getElementById('sub-menu-'+menuId);
      if(subMenu){
          if(subMenu.classList.contains('show')){
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
          }
          else{
              subMenu.classList.add('show');
              menuItem.classList.add('expanded');
          }
      }
  }

  public closeOtherSubMenus(menu:Array<SidenavMenu>, menuId){
    let currentMenuItem = menu.filter(item => item.id == menuId)[0];
    if (currentMenuItem)
      menu.forEach(item => {
          if((item.id != menuId && item.parentId == currentMenuItem.parentId) || (currentMenuItem.parentId == 0 && item.id != menuId) ){
              let subMenu = document.getElementById('sub-menu-'+item.id);
              let menuItem = document.getElementById('menu-item-'+item.id);
              if(subMenu){
                  if(subMenu.classList.contains('show')){
                      subMenu.classList.remove('show');
                      menuItem.classList.remove('expanded');
                  }
              }
          }
      });
  }

  public closeAllSubMenus(){
      sidenavMenuItems.forEach(item => {
          let subMenu = document.getElementById('sub-menu-'+item.id);
          let menuItem = document.getElementById('menu-item-'+item.id);
          if(subMenu){
              if(subMenu.classList.contains('show')){
                  subMenu.classList.remove('show');
                  menuItem.classList.remove('expanded');
              }
          }
      });
  }

}
