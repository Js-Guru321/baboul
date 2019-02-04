import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegozioComponent } from './negozio.component';

describe('NegozioComponent', () => {
  let component: NegozioComponent;
  let fixture: ComponentFixture<NegozioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegozioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegozioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
