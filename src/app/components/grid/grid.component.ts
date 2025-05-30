import { Component } from '@angular/core';
import { PatchParametersService } from '../../services/patch-parameters/patch-parameters.service';

@Component({
  selector: 'app-grid',
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  constructor(public params: PatchParametersService) {

    
  }
}
