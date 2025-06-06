import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LfoWidgetComponent } from './lfo-widget.component';

describe('LfoWidgetComponent', () => {
  let component: LfoWidgetComponent;
  let fixture: ComponentFixture<LfoWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LfoWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LfoWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
