import { interval, map, Subject, take, takeUntil } from 'rxjs';
import { Input as MidiInput, Output as MidiOutput, OutputChannel } from 'webmidi';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GridComponent } from './components/grid/grid.component';
import {
  SelectMidiInputOutputComponent
} from './components/select-midi-input-output/select-midi-input-output.component';
import { MidiPortsService } from './services/midi-ports/midi-ports.service';
import { PatchParametersService } from './services/patch-parameters/patch-parameters.service';
import { WebMidiService } from './services/web-midi/web-midi.service';
import { SequenceDataService, StepNote } from './services/sequence-data/sequence-data.service';

@Component({
  selector: 'app-root',
  imports: [GridComponent, CommonModule, SelectMidiInputOutputComponent, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sequencer';
  inputs!: MidiInput[];
  outputs!: MidiOutput[];
  stop$ = new Subject<void>();
  constructor(private webMidi: WebMidiService, private ports: MidiPortsService, private patchParameters: PatchParametersService, public sequenceData: SequenceDataService) {
    this.webMidi.ready$.then(() => {
      this.onEnabled();
    });
  }
  get outputChannel(): OutputChannel | undefined {
    let output = this.ports.selectedOutputPort;

    return output?.channels[1]; // Use the first channel of the selected output port
  }

  onEnabled() {
  }

  stop() {
    let output = this.ports.selectedOutputPort;

    if (!output) {
      console.error("No MIDI output port selected.");
      return;
    }
    if (!this.outputChannel) {
      console.error("No MIDI output channel available.");
      return;
    }
    this.outputChannel.sendAllNotesOff(); // Stop all notes on the channel
    this.stop$.next(); // Emit a value to stop the sequence

  }
  play() {

    const stepSizeMs = this.patchParameters.stepSizeMs; // Get step size in milliseconds
    const timer = interval(stepSizeMs); // Convert step size to milliseconds

    const current$ = timer.pipe(
      takeUntil(this.stop$), // Stop the sequence when stop$ emits
      map(index => {
        const noteIndex = index % this.sequenceData.steps.length; // Loop through the sequence
        console.log(`Step: ${index}, ${noteIndex}`);
        return this.sequenceData.steps[noteIndex];
      }),
    );

    const end$ = current$.pipe(
      take(this.sequenceData.steps.length)
    )

    end$.subscribe((stepData: StepNote[]) => {
      if (!this.outputChannel) {
        console.error("No MIDI output channel available.");
        this.stop$.next();
        return;
      }

      stepData.forEach((item) => {
        this.outputChannel?.playNote(item.name as string, item.options as any);
      })

    });
  }
}
