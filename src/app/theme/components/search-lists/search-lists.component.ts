import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { LocalStorageService, ProductsService } from 'src/app/services';

@Component({
  selector: 'app-search-lists',
  templateUrl: './search-lists.component.html',
  styleUrls: ['./search-lists.component.scss']
})
export class SearchListsComponent implements OnInit {
  @Input('search') private searchInput: string;
  @Input('cwidth') public menuWidth: any;

  private subject = new Subject<string>();
  private branchId: string = '';
  public searchData: any[] = [];
  public show: boolean = false;
  public loading: boolean = true;
  private folder: string;
  constructor(private productService: ProductsService,
    private router: Router,
    private _localStorage: LocalStorageService,
    private appService: AppService) {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe(x => this.sarchRsult(x));
   }

  ngOnInit() {
    this.appService.getImagePath.subscribe(res => {
      this.folder = res;
    });
    this.branchId = this._localStorage.getItem("SessionBranchIdWeb")

  }

  ngOnChanges() {
    if (!this.searchInput) {
      this.show = false;
      this.loading = false;
      return
    }
    this.subject.next(this.searchInput);
  }

  sarchRsult(keyword: string) {

    const branchId = Number(this.branchId);
    this.productService.onProductsSearch(keyword, branchId)
      .subscribe(_data => {
        let jsonFilter = JSON.parse(_data.JsonDetails[0]);
        jsonFilter.map(x => {
          if (x.ImageLoc && this.folder)
              x.ImageLoc = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folder}/${x.ImageLoc}`
        })
        this.searchData = jsonFilter.slice(0, 50);
        if (this.searchData.length) {
          this.show = true;
          this.loading = false;
        } else { this.show = false; this.loading = false; };
        }, error => console.error(error));
  }

  searchToRoute(eve) {
    if (eve.KeyType == "Catogory") {
      this.router.navigate(['/products', eve.SearchContent, { ID: [eve.KeyId], HeadId: [eve.CategoryHeadId], ProdTypeId: [eve.TypeId] }])
    } else if (eve.KeyType == "Company") {
      this.router.navigate(['/brands', eve.SearchContent, { ID: [eve.KeyId], BranchId: [this.branchId] }]);
    } else if (eve.KeyType == "Product") {
      this.router.navigate(['/products', eve.KeyId, eve.SearchContent])
    }
    this.show = false;
  }

}


