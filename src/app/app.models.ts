
export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM/y'
  },
  display: {
    // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }

};


export class CategoryHead {
  constructor(public CategoryHead_Id: number,
    public CategoryHead_Name: string,
    public CategoryHeadType: string,
    public ProductType_Id: number) { }
}

export class Category {
  constructor(public id: number,
    public name: string,
    public hasSubCategory: boolean,
    public parentId: number) { }
}

export class CartItem {
  constructor(public id: number,
    public name: string,
    public images: Array<any>,
    public oldPrice:number,
    public newPrice: number,
    public discount: number,
    public AcId: number,
    public cartCount: number,
    public categoryId:number,
    public availibilityCount: number) { }
}
export class Wishlist {
  constructor(public id: number,
    public name: string,
    public images: Array<any>,
    public oldPrice:number,
    public newPrice: number,
    public discount: number,
    public AcId: number,
    public cartCount: number,
    public categoryId:number,
    public availibilityCount: number) { }
}

export class SingleItem {
  constructor(public id: number,
    public name: string,
    public images: Array<any>,
    public oldPrice: number,
    public newPrice: number,
    public specificationid: number,
    public discount: number,
    public ratingsCount: number,
    public ratingsValue: number,
    public specification: string,
    public description: string,
    public availibilityCount: number,
    public cartCount: number,
    public color: Array<string>,
    public size: Array<string>,
    public weight: number,
    public categoryId: number) { }
}

export class Product {
  constructor(public id: number,
    public name: string,
    public images: Array<any>,
    public oldPrice: number,
    public newPrice: number,
    public specificationid: number,
    public discount: number,
    public ratingsCount: number,
    public ratingsValue: number,
    public description: string,
    public availibilityCount: number,
    public cartCount: number,
    public color: Array<string>,
    public size: Array<string>,
    public weight: number,
    public categoryId: number,
    public specificationMainId: number,
    public ManufactureId: number) { }
}


export class ProductType {
  constructor(public id: number,
    public name: string) { }
}




export class CategoryList {
  constructor(public CategoryID: number,
    public CategoryDesc: string,
    public CategoryHead_Id: number,
    public CategoryType: number) { }
}

export class UserDetail {
  constructor(public AC_Id: number,
    public AC_Name: string,
    public Addr1: string,
    public Addr2: string,
    public Addr3: string,
    public Phone: number,
    public Email: string,
    public Alias: number,
    public ExpiryDate: string,
    public BranchId: string,) { }
}
