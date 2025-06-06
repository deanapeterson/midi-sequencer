import { TestBed } from '@angular/core/testing';

import { PatternParamsService } from './pattern-params';

describe('PatchParametersService', () => {
  let service: PatternParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
