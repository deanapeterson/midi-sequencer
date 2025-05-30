import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMidiInputOutputComponent } from './select-midi-input-output.component';

describe('SelectMidiInputOutputComponent', () => {
  let component: SelectMidiInputOutputComponent;
  let fixture: ComponentFixture<SelectMidiInputOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMidiInputOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMidiInputOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
