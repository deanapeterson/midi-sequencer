import { Injectable, NgZone } from '@angular/core';
import { WebMidiService } from '../web-midi/web-midi.service';
import { MidiPortsService } from '../midi-ports/midi-ports.service';
import { PatchParametersService } from '../patch-parameters/patch-parameters.service';
import { SequenceDataService, StepNote } from '../sequence-data/sequence-data.service';
import { MidiTimeClockService, TickEvent } from '../midi-time-clock/midi-time-clock.service';
import { OutputChannel } from 'webmidi';
import { interval, map, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  public stop$ = new Subject<void>();
  private _isPlaying = false;

  get outputChannel(): OutputChannel | undefined {
    let output = this.ports.selectedOutputPort;
    return output?.channels[1]; // Use the first channel of the selected output port
  }

  constructor(
    private webMidi: WebMidiService,
    private ports: MidiPortsService,
    private patchParameters: PatchParametersService,
    private sequenceData: SequenceDataService,
    private midiTimeClock: MidiTimeClockService,
    private ngZone: NgZone
  ) { }

  start() {
    if (this._isPlaying) {
      console.warn("Transport is already playing.");
      return;
    }
    console.log("Transport started");
    this._isPlaying = true;

    const stepSizeMs = this.patchParameters.stepSizeMs;

    this.ngZone.runOutsideAngular(() => {

      this.midiTimeClock.tick$.pipe(
        takeUntil(this.stop$), // Stop the sequence when stop$ emits
        map(({stepIndex, time}: TickEvent) => {
          console.log(`Tick: ${stepIndex}`);

          // console.log(`Step: ${index}, ${noteIndex}`);
          return this.sequenceData.steps[stepIndex];
        }),
      ).subscribe((stepData: StepNote[]) => {
        if (!this.outputChannel) {
          console.error("No MIDI output channel available.");
          this.stop$.next();
          return;
        }
        console.log(stepData);

        (stepData || []).forEach((item) => {
          this.outputChannel?.playNote(item.name as string, {
            // duration: this.patchParameters.stepSizeMs, // Convert milliseconds to seconds
            duration: 200, // Convert milliseconds to seconds
          });
        })

      });
      this.midiTimeClock.start(stepSizeMs); // Start the MIDI time clock with the step size
    });


  }

  stop() {
    console.log("Transport stopped");
    let output = this.ports.selectedOutputPort;
    this._isPlaying = false;
    this.midiTimeClock.stop();
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


  pause() {
    console.log("Transport paused");
  }


}
