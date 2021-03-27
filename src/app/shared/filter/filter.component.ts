import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() selectChip: any;
  @Output() onRemoveChip: EventEmitter<any> = new EventEmitter();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  removable = true;
  selectable = true;
  selectChips = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    this.selectChips = this.selectChip;
  }
  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim()) {
  //     this.selectChips.push({name: value.trim()});
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  remove(chip): void {
    const index = this.selectChips.indexOf(chip);
    if (index >= 0) {
      this.selectChips.splice(index, 1);
      this.onRemoveChip.emit(chip)
    }
  }
}
