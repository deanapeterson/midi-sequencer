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
  name: string;
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

    this.clear$.asObservable().subscribe(()=>{
      this.generate();
    })
  }


  generate() {
    const beatCount = this.params.numberOfBeats;
    const stepCount = this.params.stepsPerBeat;
    const totalSteps = beatCount * stepCount;
    this.steps = Array.from({ length: totalSteps }, (_, i) => ([]));
  }

  updateSequenceData(add = true, note: string, beat: string, step: string): void {
    if (!note || !beat || !step) {
      console.error('Invalid parameters for updateSequenceData:', { note, beat, step });
      return;
    }

    // Convert beat and step to numbers
    const beatNumber = parseInt(beat, 10);  
    const stepNumber = parseInt(step, 10);
    if (isNaN(beatNumber) || isNaN(stepNumber)) {
      console.error('Invalid beat or step number:', { beat, step });
      return;
    }

    const stepIndex = (((beatNumber - 1) * this.params.stepsPerBeat) + (stepNumber - 1));

    console.log(`@ stepIndex: ${stepIndex} ${add ? 'Adding' : 'Removing'} sequence data for note: ${note}, beat: ${beatNumber}, step: ${stepNumber}`);
    this.updateStep(stepIndex, note, add);
  }

  
  private updateStep(stepIndex: number, note: string, add: boolean): void {
    const stepData = this.steps[stepIndex];

    if(!add){
      const noteIndex = stepData.findIndex(n => n.name === note);
      if (noteIndex !== -1) {
        stepData.splice(noteIndex, 1);
      }
      return;
    }


    stepData.push({
      name: note,
      options: {
        duration: 0.5
      }
    })
  }

}
