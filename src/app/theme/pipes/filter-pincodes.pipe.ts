import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterPincodes'
})
export class FilterPincodesPipe implements PipeTransform {
    transform(brands:Array<any>, firstLetter?) {
        if(firstLetter == 'all') {
            return brands;
        } else {            
            return brands.filter(brand => brand.Area_Name.charAt(0).toLowerCase() == firstLetter.toLowerCase());
        }    
    }
}
