/// <reference lib="webworker" />

export type MidiTimeClockWorkerMessageEventData = 'start' | 'stop' | number;

(function () {


  /**
   * Because javascript/DOM timing is unreliable, utilizing setInterval within the web worker
   * context is prefereable.
   */

  let timerID: any = null;
  let defaultInterval = 100;
  let currentInterval;

  self.onmessage = function onMessage(e: MessageEvent) {
    const data = e.data as MidiTimeClockWorkerMessageEventData;

    // START Time Clock
    if (data === "start" || typeof data === "number") {
      currentInterval = typeof data === "number" ? data : defaultInterval;

      currentInterval = Math.round(currentInterval * 1000) / 1000;

      // Already running - Do nothing
      if (timerID) {
        return;
      }

      timerID = setInterval(() => {
        postMessage("tick");
      }, currentInterval);

      return;
    }

    // STOP Time Clock
    if (e.data == "stop") {
      clearInterval(timerID);
      timerID = null;
    }
  };

}())