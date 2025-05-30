import { TestBed } from '@angular/core/testing';

import { SequenceDataService } from './sequence-data.service';

describe('SequenceDataService', () => {
  let service: SequenceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SequenceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
