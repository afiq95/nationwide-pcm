import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupListPage } from './pickup-list.page';

describe('PickupListPage', () => {
  let component: PickupListPage;
  let fixture: ComponentFixture<PickupListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
