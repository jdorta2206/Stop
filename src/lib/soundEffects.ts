// Sound effects utility for the Stop game
export class SoundEffects {
  private audioContext: AudioContext | null = null;
  private tickingInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize Web Audio API
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }

  private createOscillator(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Clock ticking sound for spinning wheel
  startClockTicking(): void {
    if (this.tickingInterval) return;

    this.tickingInterval = setInterval(() => {
      this.createOscillator(800, 0.1, 'square');
      setTimeout(() => {
        this.createOscillator(600, 0.1, 'square');
      }, 100);
    }, 200);
  }

  // Countdown timer tick sound
  startCountdownTicking(): void {
    if (this.tickingInterval) return;

    this.tickingInterval = setInterval(() => {
      this.createOscillator(1000, 0.05, 'square');
    }, 1000);
  }

  stopClockTicking(): void {
    if (this.tickingInterval) {
      clearInterval(this.tickingInterval);
      this.tickingInterval = null;
    }
  }

  stopCountdownTicking(): void {
    if (this.tickingInterval) {
      clearInterval(this.tickingInterval);
      this.tickingInterval = null;
    }
  }

  // Alarm sound when someone presses STOP
  playStopAlarm(): void {
    if (!this.audioContext) return;

    // Create alarm-like sound with multiple frequencies
    const frequencies = [800, 1000, 800, 1000, 800];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createOscillator(freq, 0.2, 'sawtooth');
      }, index * 100);
    });
  }

  // Ding sound when letter is selected
  playLetterSelected(): void {
    if (!this.audioContext) return;

    // Create a pleasant ding sound
    this.createOscillator(523.25, 0.3, 'sine'); // C5 note
    setTimeout(() => {
      this.createOscillator(659.25, 0.4, 'sine'); // E5 note
    }, 150);
  }

  // Victory sound for winner
  playVictorySound(): void {
    if (!this.audioContext) return;

    const victoryNotes = [523.25, 659.25, 783.99, 1046.50]; // C-E-G-C octave
    victoryNotes.forEach((note, index) => {
      setTimeout(() => {
        this.createOscillator(note, 0.4, 'sine');
      }, index * 200);
    });
  }

  // Game start sound
  playGameStart(): void {
    if (!this.audioContext) return;

    this.createOscillator(440, 0.3, 'sine'); // A4
    setTimeout(() => {
      this.createOscillator(554.37, 0.3, 'sine'); // C#5
    }, 100);
    setTimeout(() => {
      this.createOscillator(659.25, 0.5, 'sine'); // E5
    }, 200);
  }
}

// Export singleton instance
export const soundEffects = new SoundEffects();