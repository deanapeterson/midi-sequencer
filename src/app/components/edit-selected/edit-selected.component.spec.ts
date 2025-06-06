import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelectedComponent } from './edit-selected.component';

describe('EditSelectedComponent', () => {
  let component: EditSelectedComponent;
  let fixture: ComponentFixture<EditSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
