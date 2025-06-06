import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MidiPortsService } from '../../services/midi-ports/midi-ports.service';
import { WebMidiService } from '../../services/web-midi/web-midi.service';
import { Output as MidiOutput } from 'webmidi';


@Component({
  selector: 'app-lfo',
  templateUrl: './lfo-widget.component.html',
  styleUrls: ['./lfo-widget.component.scss'],
  imports:[FormsModule]
})
export class LfoComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  drawing = false;
  points: { x: number; y: number }[] = [];
  ccNumber = 1;
  interval = 100;
  mode: 'draw' | 'sine' | 'square' | 'saw' = 'draw';
  midiOutput: MidiOutput | null = null;
  status = 'Waiting for MIDI...';
  readonly NUM_SAMPLES = 64;
  constructor(private webMidi:WebMidiService, private midiPorts:MidiPortsService){}
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.webMidi.ready$.then(()=>{
      this.midiOutput = this.midiPorts.selectedOutputPort;
    })

  }

  onMouseDown(e: MouseEvent) {
    if (this.mode !== 'draw') return;
    this.drawing = true;
    this.points = [this.getPos(e)];
  }

  onMouseMove(e: MouseEvent) {
    if (!this.drawing || this.mode !== 'draw') return;
    this.points.push(this.getPos(e));
    this.drawLine();
  }

  onMouseUp() {
    this.drawing = false;
  }

  getPos(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  drawLine() {
    this.ctx.clearRect(0, 0, 600, 200);
    if (this.points.length < 2) return;
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.strokeStyle = '#0f0';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  handleModeChange() {
    this.points = [];
    if (this.mode !== 'draw') {
      this.sampleCurve(); // redraw preset
    } else {
      this.ctx.clearRect(0, 0, 600, 200);
    }
  }

  sampleCurve(): number[] {
    const values: number[] = [];
    const w = 600, h = 200;
    if (this.mode !== 'draw') {
      for (let i = 0; i < this.NUM_SAMPLES; i++) {
        const t = i / this.NUM_SAMPLES;
        let val = 0;
        if (this.mode === 'sine') val = 0.5 + 0.5 * Math.sin(2 * Math.PI * t);
        else if (this.mode === 'square') val = t < 0.5 ? 1 : 0;
        else if (this.mode === 'saw') val = t;
        values.push(Math.round(val * 127));
        this.points.push({ x: w * t, y: h * (1 - val) });
      }
      this.drawLine();
      return values;
    } else {
      for (let i = 0; i < this.NUM_SAMPLES; i++) {
        const x = i / (this.NUM_SAMPLES - 1) * w;
        let closest = this.points.reduce((prev, curr) =>
          Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
        );
        let y = closest.y;
        values.push(Math.round(127 * (1 - y / h)));
      }
      return values;
    }
  }

  sendLFO() {
    if (!this.midiOutput) return alert('Connect MIDI first.');
    const values = this.sampleCurve();
    let i = 0;
    setInterval(() => {
      if (i >= values.length) i = 0;
      this.midiOutput!.send([0xB0, this.ccNumber, values[i]]);
      i++;
    }, this.interval);
  }
}
