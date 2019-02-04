import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SottocategoriePopupComponent } from './sottocategorie-popup.component';

describe('SottocategoriePopupComponent', () => {
  let component: SottocategoriePopupComponent;
  let fixture: ComponentFixture<SottocategoriePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SottocategoriePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SottocategoriePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
