import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempPromoBannerComponent } from './tempPromoBanner.component';

describe('TempPromoBannerComponent', () => {
  let component: TempPromoBannerComponent;
  let fixture: ComponentFixture<TempPromoBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempPromoBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempPromoBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
