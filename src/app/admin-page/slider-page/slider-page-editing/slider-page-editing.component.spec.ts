import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderPageEditingComponent } from './slider-page-editing.component';

describe('SliderPageEditingComponent', () => {
  let component: SliderPageEditingComponent;
  let fixture: ComponentFixture<SliderPageEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderPageEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderPageEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
