import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services';

@Component({
  selector: 'app-slider-page',
  templateUrl: './slider-page.component.html',
  styleUrls: ['./slider-page.component.scss']
})
export class SliderPageComponent implements OnInit {

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  title:any = '';
  subTitle:any = '';
  description:any = '';
  sessionWebBranchId: any ;
  public baseApiUrl = environment.apiUrl;
  public imageArray = environment.imgUrl;
  loadingFlag: boolean;

  constructor(private http: Http, private _snackBar: MatSnackBar, private router: Router,
    private _localStorage: LocalStorageService) { }
  ngOnInit(): void {
    this.sessionWebBranchId = this._localStorage.getItem("SessionBranchIdWeb")
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  fnSave() {
    this.loadingFlag = true;
    let BranchId: any ;
    if (this.sessionWebBranchId == 0) {
      BranchId =0;
    } else {
      BranchId = this.sessionWebBranchId;
    }

    var imageName: any = BranchId;
    var fileFullPath = "";
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append("ImageName", imageName);
    formData.append("BranchId", BranchId);
    formData.append("Id", "0");
    formData.append("fileFullPath", fileFullPath);
    formData.append("title", this.title);
    formData.append("subTitle", this.subTitle);
    formData.append("Description", this.description);

    this.http.post(this.baseApiUrl + '/ImageUpload/UploadImageBranchS3Browser', formData)
      .subscribe(res => {
        this._snackBar.open('Save Successfully...!', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        this.loadingFlag = false;
       this.fnClear();
      }, error => (console.error(error)));
  }

  fnClear(){
    this.router.navigateByUrl('/sliderEditing');
  }
}
