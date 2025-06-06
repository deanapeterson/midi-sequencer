import { AfterViewInit, Component, computed, effect, ElementRef, HostListener, input, InputSignal, OnChanges, OnInit, Signal, SimpleChanges, ViewChild } from '@angular/core';
import { SequenceDataService, StepNote } from '../../services/sequence-data/sequence-data.service';
import { StepBlockDimensions } from '../grid/grid.component';
import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';
import { CommonModule } from '@angular/common';
import { SelectedNotesService } from '../../services/selected-notes/selected-notes.service';



interface NoteStyles {
  height: number;
  width: number;
  top: number;
  left: number;
}

@Component({
  selector: 'app-note',
  imports: [CommonModule],
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
  public selected = false;
  constructor(
    private elRef: ElementRef<HTMLElement>,
    private params: PatchParametersService,
    private sequenceData: SequenceDataService,
    private selectedNotes: SelectedNotesService
  ) {

    this.selectedNotes.requestSelectAll$.subscribe(()=>{
      this.select();
    })
    this.selectedNotes.requestDeselectAll$.subscribe(()=>{
      this.deSelect();
    })

  }
  ngOnInit() {

  }

  

  getNote() {
    return (this.note as InputSignal<StepNote>)().note as string;
  }

  getStepIndex() {
    return (this.stepIndex as InputSignal<number>)() as number;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setElementStyles(this.generateNoteStyleValues());
  }

  generateNoteStyleValues(): NoteStyles {
    const sbDim = this.stepBlockDimensions();
    this.stepBlockWidth = sbDim?.width || 0;

    const stepIndex = this.stepIndex();

    const height = (sbDim?.height || 10) - 4;
    const width = (sbDim?.width || 20) - 4;
    const left = ((stepIndex || 0) * (sbDim?.width || 20)) + 2;
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
    // console.log(stepLength);
  }

  onDrag(event: DragEvent) {
    const { target } = event;

    if (!target) {
      return;
    }

    const deltaX = event.clientX - this.dragStartX;
    const newWidth = this.dragStartWidth + deltaX;

    const updatedWidth = (Math.round(newWidth / this.stepBlockWidth) * this.stepBlockWidth) - 4;

    if (updatedWidth >= this.params.totalSteps * this.stepBlockWidth) {
      return;
    }


    this.elRef.nativeElement.style.width = `${updatedWidth}px`;
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!target.classList.contains('note-inner')) {
      return;
    }
    
    this.selected
      ? this.deSelect()
      : this.select();
  }
  
  get nativeClassList(): DOMTokenList{
    return this.elRef.nativeElement.classList;
  }
  
  addRemoveClass(className: string, remove = false){
    if(remove){ 
      this.nativeClassList.remove(className);
      return;
    }
    
    this.nativeClassList.add(className);
  }
  
  
  select(){
    this.selected = true;
    this.addRemoveClass('selected');
    this.selectedNotes.addNote(this.getNote(), this.getStepIndex());
  }
  deSelect(){
    this.selected = false;
    this.addRemoveClass('selected', true);
    this.selectedNotes.removeNote(this.getNote(), this.getStepIndex());
  }
}
