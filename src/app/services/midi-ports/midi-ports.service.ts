import { Injectable } from '@angular/core';
import { WebMidiService } from '../web-midi/web-midi.service';
import { Input as MidiInput, Output as MidiOutput } from 'webmidi';

@Injectable({
  providedIn: 'root'
})
export class MidiPortsService {
  public availableInputs: MidiInput[] = [];
  public availableOutputs: MidiOutput[] = [];
  public selectedInputPort: MidiInput | null = null;
  public selectedOutputPort: MidiOutput | null = null;

  constructor(private webMidiService: WebMidiService) {
    this.webMidiService.ready$.then(() => {
      this.availableInputs = this.webMidiService.webMidi.inputs;
      this.availableOutputs = this.webMidiService.webMidi.outputs;
    });
  }

  setInputPort(portName: MidiInput) {
    this.selectedInputPort = portName;
  }
  setOutputPort(portName: MidiOutput) {
    this.selectedOutputPort = portName;
  }
}
