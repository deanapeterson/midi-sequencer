import { Injectable } from '@angular/core';

export interface NoteWithMidi {
  note: string;
  midi: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScaleGeneratorService {
  private sharpChromatic: string[] = [
    'C', 'C#', 'D', 'D#', 'E', 'F',
    'F#', 'G', 'G#', 'A', 'A#', 'B'
  ];

  private flatEquivalents: Record<string, string> = {
    'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb',
    'G#': 'Ab', 'A#': 'Bb'
  };

  private sharpEquivalents: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#',
    'Ab': 'G#', 'Bb': 'A#'
  };

  private scaleFormulas: Record<string, number[]> = {
    'major': [2, 2, 1, 2, 2, 2, 1],
    'naturalMinor': [2, 1, 2, 2, 1, 2, 2],
    'harmonicMinor': [2, 1, 2, 2, 1, 3, 1],
    'melodicMinor': [2, 1, 2, 2, 2, 2, 1]
  };

  getAllKeys(): string[] {
    return this.sharpChromatic;
  }

  getAvailableScales(): string[] {
    return Object.keys(this.scaleFormulas);
  }

  /**
   * Generate scale with enharmonic filtering and MIDI numbers.
   */
  generateScale(
    root: string,
    scaleType: string,
    startOctave: number = 4,
    octaveRange: number = 1,
    preferSharps: boolean = true
  ): NoteWithMidi[] {
    if (!this.scaleFormulas[scaleType]) {
      throw new Error(`Unsupported scale type: ${scaleType}`);
    }

    // Normalize root to sharp version if needed
    const normalizedRoot = this.sharpEquivalents[root] || root;
    const formula = this.scaleFormulas[scaleType];
    const rootIndex = this.sharpChromatic.indexOf(normalizedRoot);

    if (rootIndex === -1) {
      throw new Error(`Invalid root note: ${root}`);
    }

    const totalNotes = (formula.length + 1) * octaveRange;
    const result: NoteWithMidi[] = [];

    let currentIndex = rootIndex;
    let currentOctave = startOctave;

    for (let i = 0; i < totalNotes; i++) {
      let baseNote = this.sharpChromatic[currentIndex];
      const midi = 12 + currentIndex + (currentOctave * 12);

      if (!preferSharps && this.flatEquivalents[baseNote]) {
        baseNote = this.flatEquivalents[baseNote];
      }

      result.push({ note: `${baseNote}${currentOctave}`, midi });

      if (i < totalNotes - 1) {
        const step = formula[i % formula.length];
        currentIndex += step;
        if (currentIndex >= this.sharpChromatic.length) {
          currentIndex %= this.sharpChromatic.length;
          currentOctave += 1;
        }
      }
    }

    return result.reverse();
  }
}
