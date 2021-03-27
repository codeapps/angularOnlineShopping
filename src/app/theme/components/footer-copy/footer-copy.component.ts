import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-copy',
  templateUrl: './footer-copy.component.html',
  styleUrls: ['./footer-copy.component.scss']
})
export class FooterCopyComponent implements OnInit {

  constructor(public appService:AppService) { }

  ngOnInit() {
  }

}
