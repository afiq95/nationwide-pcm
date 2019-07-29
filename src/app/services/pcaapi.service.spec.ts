import { TestBed } from '@angular/core/testing';

import { PCAApiService } from './pcaapi.service';

describe('PCAApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PCAApiService = TestBed.get(PCAApiService);
    expect(service).toBeTruthy();
  });
});
