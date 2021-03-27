export class SidenavMenu {
    constructor(public id: number,
                public title: string,
                public routerLink: string,
                public href: string,
                public target: string,
                public hasSubMenu: boolean,
      public parentId: number,
      public typeId: number,
    public imgLoc: string) { }
}

