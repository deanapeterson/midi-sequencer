import { TestBed } from '@angular/core/testing';

import { PatchParametersService } from './patch-parameters.service';

describe('PatchParametersService', () => {
  let service: PatchParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatchParametersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
