import { Injectable, OutputOptions } from '@angular/core';
import { PatchParametersService } from '../patch-parameters/patch-parameters.service';
import { Subject } from 'rxjs';


export interface PlayNoteOptions {
  duration?: number;
  attack?: number;
  rawAttack?: number;
  release?: number;
  rawRelease?: number;
  time?: number | string;
}

export interface StepNote {
  note: string;
  stepDuration?: number;
  options?: PlayNoteOptions;
}

@Injectable({
  providedIn: 'root'
})
export class SequenceDataService {
  public steps: StepNote[][] = [];
  public noteRows: string[] = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];
  public clear$ = new Subject();
  constructor(public params: PatchParametersService) {
    this.generate();

    this.clear$.asObservable().subscribe(() => {
      this.generate();
    })

    this.params.updated$.subscribe(() => {
      this.generate();
    })

  }
  getNote(stepIndex: number, note: string): StepNote | undefined {
    const stepNote = this.steps[stepIndex].find(noteData => noteData.note === note);
    return stepNote;
  }
  generate() {
    this.steps = Array.from({ length: this.params.totalSteps }, (_, i) => ([]));
    // console.log(this.steps);
  }

  public addNote(stepIndex: number, note: string): void {
    const stepData = this.steps[stepIndex];

    // no duplicate notes on a step.
    if (this.getNote(stepIndex, note)) {
      return;
    }

    stepData.push({
      note: note,
      options: {
        duration: this.params.stepSizeMs
      }
    })
  }

  removeNote(stepIndex: number, note: string) {
    const stepData = this.steps[stepIndex];
    const noteIndex = stepData.findIndex(n => n.note === note);
    if (noteIndex !== -1) {
      stepData.splice(noteIndex, 1);
    }
    return;
  }

  updateNoteDuration(stepIndex: number, noteName: string, stepDuration: number) {
    const stepNote = this.getNote(stepIndex, noteName);

    if (!stepNote) {
      return;
    }

    const stepOptions = stepNote.options || {};

    Object.assign(stepOptions, {
      duration: stepDuration * this.params.stepSizeMs
    })
    stepNote.options = stepOptions;
  }

  updateNoteAttackVelocity(note: string, stepIndex: number, velocityValue: number){
    const stepNote = this.getNote(stepIndex, note);

    if(!stepNote){
      return;
    }
    const stepNoteOptions: PlayNoteOptions = stepNote.options || {};

    // if (Number.isInteger(velocityValue)) {
    //   stepNoteOptions.attack = Math.round((velocityValue / 127) * 100)/100;
    // }
    // console.log(stepNoteOptions.attack);
    stepNoteOptions['rawAttack'] = velocityValue;
    stepNote.options = stepNoteOptions;
  }
}
