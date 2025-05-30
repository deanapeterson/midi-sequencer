import { TestBed } from '@angular/core/testing';

import { MidiPortsService } from './midi-ports.service';

describe('MidiConnectionsService', () => {
  let service: MidiPortsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MidiPortsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
