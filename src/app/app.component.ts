

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GridComponent } from './components/grid/grid.component';
import {
    PatternParamsComponent
} from './components/pattern-params/pattern-params.component';
import { TransportComponent } from './components/transport/transport.component';

@Component({
  selector: 'app-root',
  imports: [GridComponent, CommonModule, PatternParamsComponent, MatIconModule, MatButtonModule, TransportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Web MIDI Sequencer';
}
