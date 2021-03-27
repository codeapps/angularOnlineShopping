import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LocalStorageService, ManufactureService, ProductsService, CategoryService } from 'src/app/services';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputFile } from 'ngx-input-file';
import { Observable } from 'rxjs/Observable';
import { flatMap } from 'rxjs/operators';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  public brandColumns: string[] = ['no', 'manufacturename', 'edit'];
  public brandSource: any = [];

  public productColumns: string[] = ['edit', 'itemdesc', 'ImageLoc', 'categoryname'];
  public productSource: any = [];
  public brandView: boolean = false;
  public productView: boolean = false;
  public productForm: FormGroup;
  public progress: number;
  public Categorylist: any[] = [];
  loading: boolean;
  folderName: string = '';
  constructor(private manufactureService: ManufactureService,private httpSvc: HttpClient,
    private appService: AppService, private _localStorage: LocalStorageService,
    private categoryService: CategoryService,
    private prodService: ProductsService, public formBuilder: FormBuilder) {


  }

  ngOnInit(): void {
    this.fnManufactureGets();
    this.productForm = this.formBuilder.group({
      id: [0, Validators.required],
      productName: ['', Validators.required],
      categoryId: [0, Validators.required],
      companyName: '',
      discount: 0,
      batch: '',
      location: '',
      description: '',
      mainImage: [[], Validators.required],
      subImages: [],
    });
    this.appService.getImagePath.subscribe(res => {
      this.folderName = res
    })
  }

  fnManufactureGets() {
    this.manufactureService.onManuFactureGets()
      .toPromise().then(res => {
        let jsonData = JSON.parse(res.JsonDetails[0]);
        this.brandSource = new MatTableDataSource(jsonData);

        this.fnCategoriesGets();
      })
  }

  fnCategoriesGets() {
    let webBranchId = this._localStorage.getItem("SessionBranchIdWeb");
    if (!webBranchId)
      return
    this.categoryService.ongetProductTypewithBranchId(webBranchId)
      .toPromise().then(data => {
        this.Categorylist = JSON.parse(data.JsonDetails[2]);

      });
  }

  applyFilter(filterValue: string, key: string) {
    if (key == 'brand')
      this.brandSource.filter = filterValue.trim().toLowerCase();
    else
      this.productSource.filter = filterValue.trim().toLowerCase();

  }

  fnGetProduct(item) {

    this.prodService.onProductGetOnManufactureId(item.Manufacture_Id)
      .toPromise().then(res => {
        let productList = JSON.parse(res.JsonDetails[0]);
        this.productSource = new MatTableDataSource(productList);
        this.brandView = true;

      }, error => (console.error(error)));
  }



  onEditProduct(item) {

    this.productForm.setValue({
      id: item.ProductId,
      productName: item.ItemDesc,
      categoryId: item.CategoryCode,
      companyName: item.Manufacture_Name,
      discount: 0,
      batch: '',
      location: '',
      description: '',
      mainImage: [],
      subImages: [],
    });

    let image = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360';
    if (item.ImageLoc) {
      image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folderName}/${item.ImageLoc}`;
    }
    this.productForm.get('mainImage').setValue([{ id: item.ProductId, preview: image }]);
    this.onSubImages();
    this.productView = true;
  }


  onSubImages() {
    let prodId = this.productForm.get('id').value;
    this.prodService.fnSubImageGetOnProductId(prodId)
      .toPromise().then(res => {
        let prodSubImage = JSON.parse(res.JsonDetails[0]);
        if (prodSubImage.length) {
          let currentImages = new Array<InputFile>();
          prodSubImage.map((x, i) => {
            if (x.ProductSubImage) {
              let image = `https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.folderName}/${x.ProductSubImage}`;
              currentImages.push({ id: x.UniqueKey, preview: image });
            }
          });
          this.productForm.get('subImages').setValue(currentImages)
        }
      });
  }


  removeSubImage(eve) {
    const uniqueId = eve.id;
    if (eve.id)
      this.prodService.onSubImageRemove(uniqueId)
        .subscribe(data => {
          let jsRemove = JSON.parse(data.JsonDetails[0]);
          this.appService.snackBar.open(jsRemove.first().Flag, '', { verticalPosition: 'top', duration: 3000 })
        });
  }

  fnSave() {

    if (this.productForm.invalid) {
      this.appService.snackBar.open('Check below values are valid', '', { verticalPosition: 'top', duration: 3000 });
      return
    }

    this.fnUploadProductImage();

  }

  fnUploadProductImage() {
    let mainimageFile = this.productForm.get('mainImage').value;
    let fileToUpload = mainimageFile[0];
    const batchName = this.productForm.get('batch').value;
    const categoryId = this.productForm.get('categoryId').value;
    const companyName = this.productForm.get('companyName').value;
    const description = this.productForm.get('description').value;
    const discount = this.productForm.get('discount').value;
    const location = this.productForm.get('location').value;
    const productId = this.productForm.get('id').value;
    const prodName = this.productForm.get('productName').value;
    const formData = new FormData();
    formData.append('ProductId', productId);
    formData.append('ItemName', prodName);
    formData.append('CategoryId', categoryId);
    // formData.append('ManufactureId', fileToUpload.file, fileToUpload.file.name);
    formData.append('Specification', description);
    this.loading = true;
    // if (fileToUpload.link) {
    //   this.downloadDataAsBase64(fileToUpload.link)
    //   .subscribe((base64Data: string) => {
    //    const imageBlob = this.dataURItoBlob(base64Data);
    //     const imageFile = new File([imageBlob], 'imageName.png', { type: 'image/png' });
    //     console.log(imageFile);
    //     formData.append('file', imageFile, imageFile.name);
    //     let promise = this.appService.fileUpload('ImageUpload/UploadProductMainImage', formData).toPromise();

    //   });
    // }

    setTimeout(() => {

      if (fileToUpload.file) {
        formData.append('file', fileToUpload.file, fileToUpload.file.name);
        this.appService.fileUpload('ImageUpload/UploadProductMainImage', formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress)
              this.progress = Math.round(event.loaded * 100 / event.total);
            if (event instanceof HttpResponse) {
              this.appService.snackBar.open(event.body, '', { verticalPosition: 'top', duration: 3000 });
              this.progress = 0;
              this.loading = false;
            }

          });
      }
    }, 300);
    this.fnUploadSubImages();
  }

  dataURItoBlob(dataURI) {
    const byteString = btoa(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  private blobToBase64(blob: Blob): Observable<any> {
    const fileReader = new FileReader();
    const observable = new Observable(observer => {
      fileReader.onloadend = () => {
        observer.next(fileReader.result);
        observer.complete();
      };
    });
    fileReader.readAsDataURL(blob);
    return observable;
  }

 private downloadDataAsBase64(url: string): Observable<string> {
  return this.httpSvc.get(url, { responseType: 'blob' }).pipe(
    flatMap(blob => {
      return this.blobToBase64(blob);
    })
  );
}

  fnUploadSubImages() {
    let productId = this.productForm.get('id').value;
    let imageFile = this.productForm.get('subImages').value;
    let filesToUpload: InputFile[] = imageFile;

    const formData = new FormData();
    formData.append('productId', productId);

    Array.from(filesToUpload).map(async (x, index) => {
      if (x.file)
        return await formData.append('file' + index, x.file, x.file.name);
    });

    setTimeout(() => {
      this.loading = true;
      this.appService.fileUpload('ImageUpload/UploadSubImagesforProducts', formData)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(event.loaded * 100 / event.total);
          if (event instanceof HttpResponse) {
            this.appService.snackBar.open(event.body, '', { verticalPosition: 'top', duration: 3000 });
            this.progress = 0;
            this.loading = false;
          }
        });
    }, 300);
  }
}
