import { Injectable, OutputOptions } from '@angular/core';
import { PatchParametersService } from '../patch-parameters/patch-parameters.service';
import { Subject } from 'rxjs';


interface PlayNoteOptions {
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
  }


  generate() {
    this.steps = Array.from({ length: this.params.totalSteps }, (_, i) => ([]));
  }

  updateSequenceData(add = true, note: string, stepIndex: string | number): void {
    if (!note || !stepIndex) {
      console.error('Invalid parameters for updateSequenceData:', { note, stepIndex });
      return;
    }


    if (typeof stepIndex === 'string') {
      stepIndex = parseInt(stepIndex, 10);
    }

    // console.log(`@ stepIndex: ${stepIndex} ${add ? 'Adding' : 'Removing'} sequence data for note: ${note}, beat: ${beat}, step: ${stepIndex}`);
    this.updateStep(stepIndex, note, add);
  }


  private updateStep(stepIndex: number, note: string, add: boolean): void {
    const stepData = this.steps[stepIndex];

    if (!add) {
      const noteIndex = stepData.findIndex(n => n.note === note);
      if (noteIndex !== -1) {
        stepData.splice(noteIndex, 1);
      }
      return;
    }


    stepData.push({
      note: note,
      options: {
        duration: 0.5
      }
    })
  }

}
