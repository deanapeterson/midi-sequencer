import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternParamsComponent } from './pattern-params.component';

describe('SelectMidiInputOutputComponent', () => {
  let component: PatternParamsComponent;
  let fixture: ComponentFixture<PatternParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
