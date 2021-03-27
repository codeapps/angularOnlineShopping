import { AppService } from './../../app.service';
import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', {static:false}) sidenav: any;
  public sidenavOpen = true;
  public links = [
    { name: 'Account Dashboard', href: 'dashboard', icon: 'dashboard' },
    { name: 'Account Information', href: 'information', icon: 'info' },
    { name: 'Addresses', href: 'addresses', icon: 'location_on' },
    { name: 'Order History', href: 'orders', icon: 'add_shopping_cart' },  
    { name: 'Logout', href: '/sign-in', icon: 'power_settings_new' },    
  ];
  constructor(public appservice:AppService,public router:Router) { }

  ngOnInit() {
    if(window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
  }

  Onclicklink() {
this.appservice.fnloginOut();
  }
  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        if(window.innerWidth < 960) {
          this.sidenav.close(); 
        }
      }                
    });
  }

}
