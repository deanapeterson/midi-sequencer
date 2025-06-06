import { TestBed } from '@angular/core/testing';

import { SelectedNotesService } from './selected-notes.service';

describe('SelectedNotesService', () => {
  let service: SelectedNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
