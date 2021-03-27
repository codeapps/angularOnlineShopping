import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBannerPageComponent } from './create-banner-page.component';

describe('CreateBannerPageComponent', () => {
  let component: CreateBannerPageComponent;
  let fixture: ComponentFixture<CreateBannerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBannerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBannerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
