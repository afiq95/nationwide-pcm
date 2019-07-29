import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinePickupFormPage } from './decline-pickup-form.page';

describe('DeclinePickupFormPage', () => {
  let component: DeclinePickupFormPage;
  let fixture: ComponentFixture<DeclinePickupFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinePickupFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinePickupFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
