import { TestBed } from '@angular/core/testing';

import { HereAPIService } from './here-api.service';

describe('HereAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HereAPIService = TestBed.get(HereAPIService);
    expect(service).toBeTruthy();
  });
});
