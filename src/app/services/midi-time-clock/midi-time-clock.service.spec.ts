import { TestBed } from '@angular/core/testing';

import { MidiTimeClockService } from './midi-time-clock.service';

describe('MidiTimeClockService', () => {
  let service: MidiTimeClockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MidiTimeClockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
