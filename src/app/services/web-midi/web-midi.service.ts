import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Input as MidiInput, Output as MidiOutput, WebMidi } from 'webmidi';
@Injectable({
  providedIn: 'root'
})
export class WebMidiService {
  public ready$!: Promise<boolean>;
  public webMidi = WebMidi;
  constructor() {

    this.ready$ = new Promise((resolve, reject) => {
      this.init(resolve, reject);
    });
  }

  private init(resolve: any, reject: (reason?: any) => void) :void{
    const promise = WebMidi
      .enable()
      .catch(err => {
        reject(err);
        throw err;
      });

      promise.then(() => {
       resolve(true);
      });

  }
}
