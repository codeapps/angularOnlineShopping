import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  AcId: any;
  
  constructor(public appservice:AppService) { }

  ngOnInit() {
    this.AcId = this.appservice.dTempAcId;        
  }

}
