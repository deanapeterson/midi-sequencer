

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GridComponent } from './components/grid/grid.component';
import {
    SelectMidiInputOutputComponent
} from './components/select-midi-input-output/select-midi-input-output.component';
import { TransportComponent } from './components/transport/transport.component';

@Component({
  selector: 'app-root',
  imports: [GridComponent, CommonModule, SelectMidiInputOutputComponent, MatIconModule, MatButtonModule, TransportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Web MIDI Sequencer';
}
