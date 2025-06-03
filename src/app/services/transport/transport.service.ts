import { map, Subject, takeUntil } from 'rxjs';
import { OutputChannel } from 'webmidi';

import { Injectable, NgZone } from '@angular/core';

import { MidiPortsService } from '../midi-ports/midi-ports.service';
import { MidiTimeClockService } from '../midi-time-clock/midi-time-clock.service';
import { PatchParametersService } from '../patch-parameters/patch-parameters.service';
import { SequenceDataService, StepNote } from '../sequence-data/sequence-data.service';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  public stop$ = new Subject<void>();
  public stepIndex$ = new Subject<number>();

  private _isPlaying = false;

  constructor(
    private ports: MidiPortsService,
    private params: PatchParametersService,
    private sequenceData: SequenceDataService,
    private midiTimeClock: MidiTimeClockService,
    private ngZone: NgZone
  ) { }
  start() {

    if (this._isPlaying) {
      return;
    }
    console.log("Transport started");
    this._isPlaying = true;

    const stepSizeMs = this.params.stepSizeMs;
    const numberOfSteps = this.params.totalSteps;
    let stepIndex = 0;
    this.ngZone.runOutsideAngular(() => {

      this.midiTimeClock.tick$.pipe(
        takeUntil(this.stop$), // Stop the sequence when stop$ emits
        map(() => {
          const currentStepIndex = stepIndex;

          stepIndex = (stepIndex + 1) % numberOfSteps; // Increment step index and wrap around
          this.stepIndex$.next(currentStepIndex); // Emit the current step index
          return this.sequenceData.steps[currentStepIndex];
        }),
      ).subscribe((stepData: StepNote[]) => {
        if (!this.ports.selectedOutputPort) {
          console.error("No MIDI output port available.");
          this.stop$.next();
          return;
        }

        setTimeout(() => {
          (stepData || []).forEach((item) => {
            this.ports.selectedOutputPort?.playNote(item.note as string, item.options);
          })
          
        })
      });
      this.midiTimeClock.start(stepSizeMs); // Start the MIDI time clock with the step size
    });


  }

  stop() {
    this._isPlaying = false;
    this.midiTimeClock.stop();
    if (!this.ports.selectedOutputPort) {
      console.error("No MIDI output port selected.");
      return;
    }

    this.stop$.next(); // Emit a value to stop the sequence
    this.ports.selectedOutputPort?.sendAllNotesOff(); // Stop all notes on the channel
  }


  pause() {
    console.log("Transport paused");
  }


}
