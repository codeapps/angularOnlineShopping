import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-scodeautocomplete',
  templateUrl: './scodeautocomplete.component.html',
  styleUrls: ['./scodeautocomplete.component.css']
})

export class ScodeautocompleteComponent implements OnInit {
  @Input('fillterData') fillterData;
  @Input('columnHeader') columnHeader;
  @Input('thHeader') thHeader;
  @ViewChild('panel', {static:false}) public panel: ElementRef<any>;
  // static: false
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  current: number = 0;
  rowId: number = 0;
  constructor() { }

  ngOnInit() {}

 

  fnGetValue(item) {
    this.valueChange.emit(item);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
  switch (event.keyCode) {
    case 40:
    // ArrowDown
    if (this.rowId === this.fillterData.length - 1) {
      return;
    }
      this.rowId += 1;
    if (this.rowId >= 6) {
      this.panel.nativeElement.scrollTop += 25;
      
    }
    break;

    case 38:
    // ArrowUp
    if (this.rowId === 0) {
      return;
    }
    this.rowId -= 1;
    this.panel.nativeElement.scrollTop -= 25;
      break;
  
  case 13:
    // Enter
    this.fnGetValue(this.fillterData[this.rowId]);
    event.preventDefault();
    event.stopPropagation();
    
    break;
  default:
      this.rowId = 0;
      this.panel.nativeElement.scrollTop = 0;
    break;
}
  }

}
