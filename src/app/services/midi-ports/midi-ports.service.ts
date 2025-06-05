import { Injectable } from '@angular/core';
import { WebMidiService } from '../web-midi/web-midi.service';
import { Output as MidiOutput } from 'webmidi';
import { LocalStoreService } from '../local-store/local-store.service';

@Injectable({
  providedIn: 'root'
})
export class MidiPortsService {
  // TODO: Implement InputPorts
  public availableOutputs: MidiOutput[] = [];
  public selectedOutputPort: MidiOutput | null = null;


  private readonly OUTPUT_PORT_STORAGE_KEY = 'SELECTED_OUTPUT_PORT_NAME';

  constructor(private webMidiService: WebMidiService, private localStore: LocalStoreService) {

    const preSelectedOutputPortName = this.localStore.getItem(this.OUTPUT_PORT_STORAGE_KEY);


    this.webMidiService.ready$.then(() => {
      this.availableOutputs = this.webMidiService.webMidi.outputs;

      if(preSelectedOutputPortName) {
        const preSelectedOutputPort = this.availableOutputs.find(port=> port.name === preSelectedOutputPortName);
        preSelectedOutputPort && this.setOutputPort(preSelectedOutputPort);
      }
    });
  }

  setOutputPort(port: MidiOutput) {
    this.selectedOutputPort = port;
    this.localStore.setItem(this.OUTPUT_PORT_STORAGE_KEY, port.name);
  }
}
