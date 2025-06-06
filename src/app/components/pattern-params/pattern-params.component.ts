import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MidiPortsService } from '../../services/midi-ports/midi-ports.service';
import { PatternParamsService } from '../../services/pattern-params/pattern-params';
import { ScaleGeneratorService } from '../../services/scale-generator/scale-generator.service';

@Component({
  selector: 'app-pattern-params',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './pattern-params.component.html',
  styleUrl: './pattern-params.component.scss'
})
export class PatternParamsComponent {
  public availableTempos = [50, 65, 80, 95, 100, 110, 120, 140, 155, 160];
  public availableStepsPerBeat = [1, 2, 3, 4, 5, 6, 7, 8];
  public availableBeats = [1, 2, 3, 4, 5, 6, 7, 8];
  constructor(
    public ports: MidiPortsService,
    public params: PatternParamsService,
    public scales: ScaleGeneratorService
  ) {
  }
}
