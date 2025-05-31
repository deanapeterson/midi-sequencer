import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SequenceDataService } from '../sequence-data/sequence-data.service';

export interface TickEvent {
  time: DOMHighResTimeStamp;
  stepIndex: number;
}


@Injectable({
  providedIn: 'root'
})
export class MidiTimeClockService implements OnDestroy {
  private worker: Worker | null = null;
  private performance = window.performance;
  public tick$ = new Subject<TickEvent>();
  defaultInterval = 100; // Default interval is 100 milliseconds

  constructor(private ngZone: NgZone, private sequenceData: SequenceDataService) { // Replace 'any' with the actual type of sequenceData if available
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers are not supported in this environment.');
      return;
    }

    this.worker = new Worker(new URL('../../midi-time-clock.worker', import.meta.url));

  }
  ngOnDestroy() {
    if (!this.worker) {
      return;
    }
    this.worker.terminate();
    this.worker = null;
  }
  start(interval: number = this.defaultInterval) {
    if (!this.worker) {
      console.error('Worker is not initialized.');
      return;
    }

    this.startListening();
    this.worker.postMessage(interval);
  }
  stop() {
    if (!this.worker) {
      console.error('Worker is not initialized.');
      return;
    }
    this.worker.onmessage = null; // Clear the message handler
    this.worker.postMessage("stop");
  }

  startListening() {
    let stepIndex = 0;
    this.ngZone.runOutsideAngular(() => {
      if (!this.worker) {
        console.error('Worker is not initialized.');
        return;
      }
      this.worker.onmessage = (event: MessageEvent) => {
        if (event.data !== 'tick') {
          return
        }

        stepIndex = stepIndex % this.sequenceData.steps.length; // Loop through the sequence

        this.tick$.next({
          time: this.performance.now(),
          stepIndex
        });
        stepIndex++;
      };
    })
  }
}