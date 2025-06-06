

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav'
import { GridComponent } from './components/grid/grid.component';
import {
  PatternParamsComponent
} from './components/pattern-params/pattern-params.component';
import { TransportComponent } from './components/transport/transport.component';
import { SelectedNotesService } from './services/selected-notes/selected-notes.service';
import { EditSelectedComponent } from './components/edit-selected/edit-selected.component';

@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    GridComponent, CommonModule, PatternParamsComponent, 
    MatIconModule, MatButtonModule, TransportComponent, EditSelectedComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit{
  title = 'Web MIDI Sequencer';
  @ViewChild('sideNav') sideNav!: MatDrawer;
  constructor(public selectedNotes: SelectedNotesService) { }
  ngAfterViewInit(){
    this.selectedNotes.hasSelections$.subscribe(()=>{
      console.log('hasSelection');
      
      this.sideNav.open();
    });
    this.selectedNotes.isEmpty$.subscribe(()=>{
      console.log('no selection');
      
      this.sideNav.close();
    });


  }
}
