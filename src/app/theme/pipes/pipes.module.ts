import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe';
import { FilterBrandsPipe } from './filter-brands.pipe';
import { BrandSearchPipe } from './brand-search.pipe';
import { GrdFilterPipe } from './grd-filter.pipe';
import { FilterPincodesPipe } from './filter-pincodes.pipe';
import { PincodeSearchPipe } from './pincode-search.pipe';

@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        GrdFilterPipe,
        FilterPincodesPipe,
        PincodeSearchPipe
    ],
    exports: [
        FilterByIdPipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        GrdFilterPipe,
        FilterPincodesPipe,
        PincodeSearchPipe
    ]
})
export class PipesModule { }
