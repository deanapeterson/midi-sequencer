import { Component, ElementRef, HostListener, NgZone, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';
import { CommonModule } from '@angular/common';
import { debounce } from '../../utilities/debounce';
import { SequenceDataService } from '../../services/sequence-data/sequence-data.service';
import { TransportService } from '../../services/transport/transport.service';
import { MidiTimeClockService, TickEvent } from '../../services/midi-time-clock/midi-time-clock.service';


export interface StepParams {
  stepIndex: number;
  stepCount: number;
  beat: number;
  beatIndex: number;
  active: boolean;
}


@Component({
  selector: 'app-grid',
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  public gridSteps: StepParams[] = [];
  public noteRows: string[];
  private style!: HTMLStyleElement;
  constructor(
    private ngZone: NgZone,
    public params: PatchParametersService,
    private sequenceData: SequenceDataService,
    private timeClock: MidiTimeClockService,
    private transport: TransportService,
    private renderer: Renderer2,
    private elRef: ElementRef) {

    this.style = this.renderer.createElement('style');
    this.elRef.nativeElement.appendChild(this.style);

    this.noteRows = [
      "C3",
      "D3",
      "E3",
      "F3",
      "G3",
      "A3",
      "B3",
      "C4",
    ].reverse();

    this.sequenceData.clear$.subscribe(() => {
      const actives: NodeList = elRef.nativeElement.querySelectorAll('[data-active = "true"]');
      Array.from(actives).forEach((item: Node) => {
        delete (item as HTMLElement).dataset['active'];
      })
    });

    this.transport.stop$.subscribe(() => {
      this.style.textContent = ``;
    });

    this.ngZone.runOutsideAngular(() => {

      this.timeClock.tick$.subscribe((event: TickEvent) => {
        setTimeout(() => {

          this.style.textContent = `
          [data-step-index="${event.stepIndex}"] {
              background-color: rgba(218, 21, 21, 0.21) !important;
          }`;

        }, this.params.stepSizeMs);
      })




    })
  }

  @HostListener('click', ['$event.target'])
  // @debounce(50)
  onClick(target: HTMLElement) {
    const active = target.dataset['active'] === 'true';
    console.log(target.dataset);
    if (active) {
      target.dataset['active'] = 'false';
      target.classList.remove('active');
    } else {
      target.dataset['active'] = 'true';
      target.classList.add('active');
    }

    this.sequenceData.updateSequenceData(
      !active,
      target.dataset['note'] || '',
      target.dataset['stepIndex'] || ''
    );
  }



  ngOnInit() {

    this.params.updated$.subscribe(() => {
      this.gridSteps = this.generateGrid();
    })
  }

  private generateGrid(): StepParams[] {
    return Array.from({ length: this.params.totalSteps }, (item, stepIndex) => {
      const beatIndex = stepIndex % this.params.stepsPerBeat;
      const beat = Math.floor(stepIndex / this.params.stepsPerBeat) + 1;
      const stepCount = stepIndex + 1;

      // console.log(`Step Index: ${stepIndex}, Beat: ${beat}, Beat Index: ${beatIndex}`);

      return {
        stepIndex,
        stepCount,
        beat,
        beatIndex,
        active: false
      };
    }
    );
  }
}


