import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'brandSearchPipe', pure: false })
export class BrandSearchPipe implements PipeTransform {
  transform(brands, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (brands) {
      return brands.filter(brand => {
        if (brand.Manufacture_Name) {
          return brand.Manufacture_Name.search(searchText) !== -1;
        }
      });
    }
  }
}
