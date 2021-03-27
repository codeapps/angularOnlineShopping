import { Component, Input, Output, EventEmitter, DoCheck,OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements DoCheck {
  @Input() Categorylist;
  @Input() categories;
  @Input() categoryParentId;
  @Output() change: EventEmitter<any> = new EventEmitter();
  mainCategories;
  searchCategory: any;
  JsonCategories: any;


  constructor(public appService:AppService) {


    this.mainCategories = [];
    this.mainCategories = this.appService.Data.categories;

    }


  public ngDoCheck() {

    // if(this.Categorylist && !this.mainCategories) {
    //   this.mainCategories = this.Categorylist.filter(category => category.CategoryHead_Id == this.categoryParentId);
    // }
  }

  public stopClickPropagate(event: any) {
    if(window.innerWidth < 960) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  public changeCategory(event,value) {
    this.appService.Data.ChangeCaetegoryId = null;
    this.change.emit(event);
    // this.appService.Data.ChangeCaetegoryId = value;
    this.appService.fnchangeCategory(value).subscribe(element => {
      let _data: any = element;
      this.searchCategory = JSON.parse(_data);
      this.appService.Data.CategoryLists = this.searchCategory;
     });

  }


}
