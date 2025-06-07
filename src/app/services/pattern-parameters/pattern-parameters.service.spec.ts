import { TestBed } from '@angular/core/testing';

import { PatternParametersService } from './pattern-parameters.service';

describe('PatternParametersService', () => {
  let service: PatternParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternParametersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
