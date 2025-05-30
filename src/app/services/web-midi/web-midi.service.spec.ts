import { TestBed } from '@angular/core/testing';

import { WebMidiService } from './web-midi.service';

describe('WebMidiService', () => {
  let service: WebMidiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebMidiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
