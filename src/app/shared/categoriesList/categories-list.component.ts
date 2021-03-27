import { Component } from '@angular/core';
import { AppService } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html'
})

export class CategoriesListComponent {
           
      mainCategories;
      dTempProdTypeId: any;
      
      constructor(public appService:AppService,private activatedRoute: ActivatedRoute,) {
        this.activatedRoute.params.subscribe(params => {
          this.dTempProdTypeId = params['ProdTypeId'];
       });
        this.mainCategories = [];
          this.mainCategories = this.appService.Data.categoryHead; 
        }
        changeCategory(ev, val) {
        }
}
