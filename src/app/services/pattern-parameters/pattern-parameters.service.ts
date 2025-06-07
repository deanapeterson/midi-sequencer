import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebMidiService } from '../web-midi/web-midi.service';

@Injectable({
  providedIn: 'root'
})
export class PatternParametersService {
  public tempo: number = 120; // Default tempo in BPM
  public numberOfBeats: number = 4; // Default number of beats in the sequence
  public stepsPerBeat: number = 4; // Default steps per beat (16th notes)
  public sequence: Array<[string, { duration: number, rawAttack: number }]> = [];
  public updated$ = new Subject<void>();

  public get totalSteps(): number {
    return this.numberOfBeats * this.stepsPerBeat;
  }

  public get stepSizeMs() {
    return ((60 / this.tempo) / this.stepsPerBeat) * 1000;
  }

  constructor(private webMidiService: WebMidiService) { 

    this.webMidiService.ready$.then(() => {
      this.updated$.next(); // Emit initial update
    });


  }

  setTempo(tempo: number) {
    if (tempo < 20 || tempo > 300) {
      console.error("Tempo must be between 20 and 300 BPM.");
      return;
    }
    this.tempo = tempo;
    this.updated$.next();
  }
  setStepsPerBeat(steps: number) {
    if (steps < 1 || steps > 8) {
      console.error("Steps per beat must be between 1 and 8.");
      return;
    }
    this.stepsPerBeat = steps;
    this.updated$.next();
  }

  setNumberOfBeats(beats: number) {
    if (beats < 1 || beats > 8) {
      console.error("Number of beats must be between 1 and 8.");
      return;
    }
    this.numberOfBeats = beats;
    this.updated$.next();
  }
}
