import { Injectable, OutputOptions } from '@angular/core';
import { PatchParametersService } from '../patch-parameters/patch-parameters.service';


interface PlayNoteOptions {
  duration?: number;
  attack?: number;
  rawAttack?: number;
  release?: number;
  rawRelease?: number;
  time?: number | string;
}

interface Note {
  name: string;
  options?: PlayNoteOptions;
}

@Injectable({
  providedIn: 'root'
})
export class SequenceDataService {

  public steps: Note[][] = [];
  public noteRows: string[] = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

  constructor(public params: PatchParametersService) {

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

    const stepIndex = beatNumber * this.params.stepsPerBeat;
    
    // console.log(`Updating sequence data at index: ${stepIndex} for note: ${note}, beat: ${beat}, step: ${step}`);


    // Logic to update the sequence data based on the note, beat, and step
    console.log(`@ stepIndex:  ${stepIndex} ${add ? 'Adding' : 'Removing'} sequence data for note: ${note}, beat: ${beat}, step: ${step}`);
    // Here you would typically update an internal data structure or send this data to a server
  }
}
