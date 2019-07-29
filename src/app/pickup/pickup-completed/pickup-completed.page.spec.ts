import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupCompletedPage } from './pickup-completed.page';

describe('PickupCompletedPage', () => {
  let component: PickupCompletedPage;
  let fixture: ComponentFixture<PickupCompletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupCompletedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
