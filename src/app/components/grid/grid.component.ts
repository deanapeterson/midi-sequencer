import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterRenderOptions, AfterRenderRef, AfterViewChecked, AfterViewInit, Component, computed, ElementRef, HostListener, NgZone, OnInit, QueryList, Renderer2, signal, ViewChild, ViewChildren } from '@angular/core';

import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';
import { SequenceDataService } from '../../services/sequence-data/sequence-data.service';
import { TransportService } from '../../services/transport/transport.service';
import { NoteComponent } from '../note/note.component';

export interface StepParams {
  stepIndex: number;
  stepCount: number;
  beat: number;
  beatIndex: number;
  active: boolean;
}

export interface StepBlockDimensions {
  height: number;
  width: number;
}

export enum EditMode {
  DRAW = 'draw',
  DELETE = 'delete',
  EDIT = 'edit',
}

@Component({
  selector: 'app-grid',
  imports: [CommonModule, NoteComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit, AfterViewInit {
  public gridSteps: StepParams[] = [];
  public noteRows: string[];
  private style!: HTMLStyleElement;
  
  public EditMode = EditMode;
  public editMode = EditMode.DRAW;


  public stepBlockDimensions = signal<{ height: number, width: number }>({ height: 0, width: 0 });
  @ViewChildren('stepblocks') stepBlocks!: QueryList<HTMLElement>;
  constructor(
    private ngZone: NgZone,
    public params: PatchParametersService,
    public sequenceData: SequenceDataService,
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

    // const markerOffset = this.params.stepSizeMs;
    const markerOffset = 0;

    this.sequenceData.clear$.subscribe(() => {
      this.clearActiveStepBlocks();
      this.style.textContent = ``;
    });

    this.transport.stop$.subscribe(() => {
      this.style.textContent = ``;
    });
    this.params.updated$.subscribe(() => {
      this.clearActiveStepBlocks();
      // this.getStepBlockDimensions();
    });
    this.ngZone.runOutsideAngular(() => {

      this.transport.stepIndex$.subscribe((stepIndex: number) => {
        setTimeout(() => {

          this.style.textContent = `
          [data-step-index="${stepIndex}"] {
              background-color: rgba(218, 21, 21, 0.21) !important;
          }`;

        }, markerOffset);
      })
    })
  }
  ngOnInit() {
    this.params.updated$.subscribe(() => {
      this.gridSteps = this.generateGrid();
    });

  }
  ngAfterViewInit() {
    this.stepBlocks?.changes.subscribe((blockChanges: QueryList<ElementRef>) => {
      const first = blockChanges.get(0);
      if (!first) {
        return;
      }
      const dim = {
        width: first.nativeElement.offsetWidth,
        height: first.nativeElement.offsetHeight
      }
      this.stepBlockDimensions.set(dim);
    })
  }

  @HostListener('window:keydown', ['$event'])
  onKeyhold(event: KeyboardEvent) {
    const { key } = event;
    console.log(key);
    if (key === 'd') {
      this.editMode = this.editMode == EditMode.DELETE ? EditMode.DRAW : EditMode.DELETE;
      return;
    }

    if (key === 'e') {
      this.editMode = this.editMode == EditMode.EDIT ? EditMode.DRAW : EditMode.EDIT;
      return;
    }

  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event:PointerEvent){
    const {target} = $event;
    
    $event.preventDefault();
    
    if(!target){
      return;
    }

    if((target as HTMLElement).classList.contains('note-inner')){
      this.deleteNote(target as HTMLElement);
      return;
    }

  }


  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {

    if (target.classList.contains('step-block')) {
      this.addNote(target);
      return;
    }

    if(this.editMode === EditMode.DELETE && target.classList.contains('note-inner')){
      this.deleteNote(target);
      return;
    }

  }

  addNote(stepBlockEl: HTMLElement){
    const stepIndex = parseInt(stepBlockEl.dataset['stepIndex'] || '', 10);
    const note = stepBlockEl.dataset['note'] || '';
    this.sequenceData.addNote(stepIndex, note);
  }

  deleteNote(stepBlockEl: HTMLElement){
    const stepIndex = parseInt(stepBlockEl.dataset['stepIndex'] || '', 10);
    const noteName = stepBlockEl.dataset['noteName'] || '';


    // console.log('deleteNote', stepIndex, noteName);
      this.sequenceData.removeNote(stepIndex, noteName);
  }

  private clearActiveStepBlocks() {
    const actives: NodeList = this.elRef.nativeElement.querySelectorAll('[data-active = "true"]');
    Array.from(actives).forEach((item: Node) => {
      delete (item as HTMLElement).dataset['active'];
    })
  }

  private generateGrid(): StepParams[] {
    return Array.from({ length: this.params.totalSteps }, (item, stepIndex) => {
      const beatIndex = stepIndex % this.params.stepsPerBeat;
      const beat = Math.floor(stepIndex / this.params.stepsPerBeat) + 1;
      const stepCount = stepIndex + 1;

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


