import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VetrinaComponent } from './vetrina.component';

describe('VetrinaComponent', () => {
  let component: VetrinaComponent;
  let fixture: ComponentFixture<VetrinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetrinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
