import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MidiPortsService } from '../../services/midi-ports/midi-ports.service';
import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';

@Component({
  selector: 'app-select-midi-input-output',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './select-midi-input-output.component.html',
  styleUrl: './select-midi-input-output.component.scss'
})
export class SelectMidiInputOutputComponent {
  public availableTempos = [50, 65, 80, 95, 110, 120, 140, 155, 160];
  public availableStepsPerBeat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  public availableBeats = [1, 2, 3, 4, 5, 6, 7, 8];
  constructor(public ports: MidiPortsService, public params: PatchParametersService) {
  }
}
