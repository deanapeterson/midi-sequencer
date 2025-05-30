import { Component, HostListener } from '@angular/core';
import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';
import { CommonModule } from '@angular/common';
import { debounce } from '../../utilities/debounce';

@Component({
  selector: 'app-grid',
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {

  private stepsPerBeat = 8;
  private totalBeats = 4;

  public gridBeats: number[][] = [];
  public noteRows: string[];

  constructor(public params: PatchParametersService) {
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

  }
  // @HostListener('mouseover', ['$event.target'])
  // @debounce()
  // onMouseover(target: HTMLElement) {
  //   console.log('target', target);
  // }

  @HostListener('click', ['$event.target'])
  @debounce()
  onClick(target: HTMLElement) {
    console.log('target', target.dataset);




  }



  ngOnInit() {
    this.generateGrid();
  }

  private generateGrid() {
    this.gridBeats = Array.from({ length: this.totalBeats }, () =>
      Array.from({ length: this.stepsPerBeat }, (_, j) => j + 1)
    );
  }
}
