import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SequenceDataService } from '../../services/sequence-data/sequence-data.service';
import { TransportService } from '../../services/transport/transport.service';
import { SelectedNotesService } from '../../services/selected-notes/selected-notes.service';

@Component({
  selector: 'app-transport',
  imports: [MatIconModule,MatButtonModule],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss'
})
export class TransportComponent {
  constructor(
    public sequenceData:SequenceDataService,
    public transport: TransportService,
    public selected: SelectedNotesService
  ) { }
}
