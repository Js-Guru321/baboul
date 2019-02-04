import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPromoButtonComponent } from './follow-promo-button.component';

describe('FollowPromoButtonComponent', () => {
  let component: FollowPromoButtonComponent;
  let fixture: ComponentFixture<FollowPromoButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowPromoButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowPromoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
