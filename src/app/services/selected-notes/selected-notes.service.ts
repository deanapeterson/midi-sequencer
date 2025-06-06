import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface SelectedNote {
  note: string;
  stepIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class SelectedNotesService {
  selected: SelectedNote[] = [];
  requestSelectAll$ = new Subject<void>();
  requestDeselectAll$ = new Subject<void>();
  constructor() { }
  get hasSelection(){
    return this.selected.length > 0;
  }
  addNote(note: string, stepIndex: number) {
    const isDuplicate = !this.selected.find(selectedNote => selectedNote.note === note && selectedNote.stepIndex === stepIndex);
    // No duplicates
    if (isDuplicate) {

      this.selected.push({
        note, stepIndex
      })
      console.log(`${note} at ${stepIndex} has been added: ${this.isSelected(note,stepIndex)}`)

    }
  }
  removeNote(note: string, stepIndex: number) {
    const toRemove = this.selected.find(selectedNote => {
      return selectedNote.note === note && selectedNote.stepIndex === stepIndex;
    })

    if (toRemove) {
      this.selected = this.selected.filter(selectedNote =>
        !(selectedNote.note === note && selectedNote.stepIndex === stepIndex)
      );
      console.log(`${note} at ${stepIndex} has been removed: ${!this.isSelected(note,stepIndex)}`)
    }
  }

  isSelected(note: string, stepIndex: number): boolean {
    const selected = this.selected.find(selectedNote => {
      return selectedNote.note === note && selectedNote.stepIndex === stepIndex;
    })

    return !!selected;
  }

  requestSelectAll(){
    this.requestSelectAll$.next();
  }

  requestDeselectAll(){
    this.requestDeselectAll$.next();
  }

}