import { AfterViewInit, Component, computed, effect, ElementRef, HostListener, input, OnChanges, OnInit, Signal, SimpleChanges, ViewChild } from '@angular/core';
import { SequenceDataService, StepNote } from '../../services/sequence-data/sequence-data.service';
import { StepBlockDimensions } from '../grid/grid.component';
import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';



interface NoteStyles {
  height: number;
  width: number;
  top: number;
  left: number;
}

@Component({
  selector: 'app-note',
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent implements OnChanges, OnInit {
  public note = input<StepNote>();
  public stepIndex = input<number>();
  public stepBlockDimensions = input<StepBlockDimensions>();

  private dragStartWidth!: number;
  private dragStartX!: number;

  private stepBlockWidth = 0;
  constructor(
    private elRef: ElementRef<HTMLElement>,
    private params: PatchParametersService,
    private sequenceData: SequenceDataService
  ) { }

  generateNoteStyleValues(): NoteStyles {
    const sbDim = this.stepBlockDimensions();
    this.stepBlockWidth = sbDim?.width || 0;

    const stepIndex = this.stepIndex();
    const height = (sbDim?.height || 10) - 4;
    const width = (sbDim?.width || 20) - 4;
    const left = ((stepIndex || 0) * (sbDim?.width || 20)) + 4;
    const top = 2;

    return {
      height,
      width,
      left,
      top
    }
  }

  // Consider debounce
  setElementStyles(styles: NoteStyles) {
    this.elRef.nativeElement.style.width = `${styles.width}px`;
    this.elRef.nativeElement.style.height = `${styles.height}px`;
    this.elRef.nativeElement.style.left = `${styles.left}px`;
    this.elRef.nativeElement.style.top = `${styles.top}px`;
  }
  ngOnInit() {
    // this.elRef.nativeElement.setAttribute('draggable', 'true');
  }
  ngOnChanges(changes: SimpleChanges) {
    this.setElementStyles(this.generateNoteStyleValues());
  }

  get currentWidth() {
    return this.elRef.nativeElement.offsetWidth;
  }

  onDragStart(event: DragEvent) {
    const { target } = event;

    this.dragStartWidth = (target as HTMLElement).offsetWidth;
    this.dragStartX = event.clientX;

  }
  onDragEnd(event: DragEvent) {
    const stepLength = Math.ceil(this.currentWidth / this.stepBlockWidth);
    this.sequenceData.updateNoteDuration(this.stepIndex() as number, (this.note() as StepNote).note as string, stepLength);
    console.log(stepLength);
  }

  onDrag(event: DragEvent) {
    const { target } = event;

    if (!target) {
      return;
    }

    const deltaX = event.clientX - this.dragStartX;
    const newWidth = this.dragStartWidth + deltaX;

    const updatedWidth = (Math.round(newWidth / this.stepBlockWidth) * this.stepBlockWidth) - 8;

    if (updatedWidth >= this.params.totalSteps * this.stepBlockWidth) {
      return;
    }


    this.elRef.nativeElement.style.width = `${updatedWidth}px`;
  }
  updateNote() {

  }
}
