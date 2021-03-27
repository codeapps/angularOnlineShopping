import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services';
import { Settings, AppSettings } from '../../../app.settings';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements AfterViewInit {
  public showOptions = false;
  public settings: Settings;
  theameSelected: string;
  constructor(public appSettings:AppSettings, private _localStorage: LocalStorageService) {
    this.theameSelected = _localStorage.getItem('theme');
    this.settings = this.appSettings.settings;
  }

ngAfterViewInit(): void {

}
ngOnChanges(): void {
  if(this.theameSelected !== null) {
    setTimeout(() => {
      this.settings.theme = this.theameSelected;
    }, 100);

  }
}
  public changeTheme(theme) {
    this._localStorage.removeItem('theme');
    this._localStorage.setItem('theme', theme);
    this.settings.theme = theme;
  }
}
