import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { SelectedNotesService } from '../../services/selected-notes/selected-notes.service';
@Component({
  selector: 'app-edit-selected',
  imports: [MatSliderModule, FormsModule, MatCardModule],
  templateUrl: './edit-selected.component.html',
  styleUrl: './edit-selected.component.scss'
})
export class EditSelectedComponent {
  public velocity = 90;

  constructor(private selectedNotes: SelectedNotesService) {

  }
  velocityChange(velocityValue: number) {
    this.selectedNotes.requestVelocityChange(velocityValue)
  }
}
