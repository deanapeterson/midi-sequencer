

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GridComponent } from './components/grid/grid.component';
import {
    PatternParamsComponent
} from './components/pattern-params/pattern-params.component';
import { TransportComponent } from './components/transport/transport.component';
import { LfoComponent } from "./components/lfo-widget/lfo-widget.component";

@Component({
  selector: 'app-root',
  imports: [GridComponent, CommonModule, PatternParamsComponent, MatIconModule, MatButtonModule, TransportComponent, LfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Web MIDI Sequencer';
}
