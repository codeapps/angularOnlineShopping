import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pincodeSearchPipe', pure: false })
export class PincodeSearchPipe implements PipeTransform {
  transform(brands, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (brands) {
      return brands.filter(brand => {
        if (brand.Area_Name) {
          return brand.Area_Name.search(searchText) !== -1;
        }
      });
    }
  }
}
