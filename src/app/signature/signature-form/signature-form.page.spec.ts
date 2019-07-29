import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureFormPage } from './signature-form.page';

describe('SignatureFormPage', () => {
  let component: SignatureFormPage;
  let fixture: ComponentFixture<SignatureFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
