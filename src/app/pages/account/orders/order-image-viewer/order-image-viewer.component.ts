import { AppService } from 'src/app/app.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-order-image-viewer',
  templateUrl: './order-image-viewer.component.html',
  styleUrls: ['./order-image-viewer.component.scss']
})
export class OrderImageViewerComponent implements OnInit {
  ImageLoc: string;

  constructor(@Inject(MAT_DIALOG_DATA) public order: any,
    public appService: AppService, public dialogRef: MatDialogRef<OrderImageViewerComponent>) { }

  ngOnInit() {
    let DataValue: any = this.order;
    if (DataValue.OrderMainImageLoc == null || DataValue.OrderMainImageLoc == '') {
      this.ImageLoc = 'https://via.placeholder.com/180x135/607D8B/fff/?text=480 X 360';
    } else {
      this.ImageLoc = 'https://s3.ap-south-1.amazonaws.com/productcodeappsimage/' + this.appService.getImagePath + '/' + DataValue.OrderMainImageLoc;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
