import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connectionerror',
  templateUrl: './connectionerror.component.html',
  styleUrls: ['./connectionerror.component.scss']
})
export class ConnectionerrorComponent implements OnInit {
  
  constructor(private router: Router) {
    
   }

  ngOnInit() {
  }
  refresh() {
    this.router.navigate(['/']);
  }
}
