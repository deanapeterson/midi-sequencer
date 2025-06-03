import { AfterViewInit, Component, computed, effect, ElementRef, HostListener, input, OnChanges, OnInit, Signal, SimpleChanges, ViewChild } from '@angular/core';
import { StepNote } from '../../services/sequence-data/sequence-data.service';
import { StepBlockDimensions } from '../grid/grid.component';



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
  private initialWidth!: number;

  private initialCursorX!: number;
  private stepBlockWidth = 0;
  constructor(private elRef: ElementRef<HTMLElement>) { }

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


  onDragStart(event: DragEvent) {
    const { target } = event;

    this.initialWidth = (target as HTMLElement).offsetWidth;
    this.initialCursorX = event.clientX;

  }


  onDrag(event: DragEvent) {
    const { target } = event;

    if (!target) {
      return;
    }

    const deltaX = event.clientX - this.initialCursorX;
    const newWidth = this.initialWidth + deltaX;

    const snappedX = Math.round(newWidth / this.stepBlockWidth) * this.stepBlockWidth;
    // const snappedY = Math.round(dy / this.stepBlockWidth) * this.stepBlockWidth;
    this.initialWidth = snappedX;


    this.elRef.nativeElement.style.width = `${snappedX}px`;
    // event.preventDefault();
  }
}
