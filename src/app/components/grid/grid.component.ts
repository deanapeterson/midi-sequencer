import { Component, ElementRef, HostListener, ViewChildren } from '@angular/core';
import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';
import { CommonModule } from '@angular/common';
import { debounce } from '../../utilities/debounce';
import { SequenceDataService } from '../../services/sequence-data/sequence-data.service';

@Component({
  selector: 'app-grid',
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {



  public gridBeats: number[][] = [];
  public noteRows: string[];
  @ViewChildren('[data-active]') activeCells!: ElementRef;
  constructor(public params: PatchParametersService, private sequenceData: SequenceDataService) {
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

    this.sequenceData.clear$.subscribe(()=>{
      console.log(this.activeCells);
    });


  }

  @HostListener('click', ['$event.target'])
  @debounce(50)
  onClick(target: HTMLElement) {
    const active = target.dataset['active'] === 'true';

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
      target.dataset['beat'] || '',
      target.dataset['step'] || ''
    );
  }



  ngOnInit() {
    this.generateGrid();
  }

  private generateGrid() {
    this.gridBeats = Array.from({ length: this.params.numberOfBeats }, () =>
      Array.from({ length: this.params.stepsPerBeat }, (_, j) => j + 1)
    );
  }
}
