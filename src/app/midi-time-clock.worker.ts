/// <reference lib="webworker" />

// addEventListener('message', ({ data }) => {
//   const response = `worker response to ${data}`;
//   postMessage(response);
// });


export type MidiTimeClockWorkerMessageEventData = 'start' | 'stop' | number;

let timerID: any = null;
let defaultInterval = 100;
let currentInterval;
const performance = self.performance;
self.onmessage = function onMessage(e: MessageEvent) {
  const data = e.data as MidiTimeClockWorkerMessageEventData;
  if (data === "start" || typeof data === "number") {
    currentInterval = typeof data === "number" ? data : defaultInterval;

    currentInterval = Math.round(currentInterval * 1000) / 1000;

    if (timerID) {
      console.log("MidiTimeClockWorker: already running");
      return;
    }
    console.log("MidiTimeClockWorker: starting with interval", currentInterval);

    timerID = setInterval(() => {
      if (performance && performance.now) {
        console.log("MidiTimeClockWorker: tick at", performance.now());
      } else {
        console.warn("MidiTimeClockWorker: performance.now() is not available");
      }
      postMessage("tick");
    }, currentInterval);

    return;
  }

  if (e.data == "stop") {
    console.log("MidiTimeClockWorker: stopping");
    clearInterval(timerID);
    timerID = null;
  }
};

postMessage('hi there');