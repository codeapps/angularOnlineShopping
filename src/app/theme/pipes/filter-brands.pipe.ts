import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterBrands'
})
export class FilterBrandsPipe implements PipeTransform {
    transform(brands:Array<any>, firstLetter?) {
        if(firstLetter == 'all') {
            return brands;
        } else {            
            return brands.filter(brand => brand.Manufacture_Name.charAt(0).toLowerCase() == firstLetter.toLowerCase());
        }    
    }
}
