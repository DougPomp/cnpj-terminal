/**
 * Web Audio API Sound Synthesizer & 16-bit Chiptune BGM Generator para CNPJ Terminal
 * Produz áudio sintetizado nativo sem arquivos externos.
 */

// Frequências das notas (Escala Pentatônica Menor de Lá / Am Cyber)
const NOTES: Record<string, number> = {
  A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.00,
  A3: 220.00, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  G5: 783.99, A5: 880.00, REST: 0,
};

// Sequência Chiptune 16-bits (32 passos de 16º de nota)
const BGM_MELODY: string[] = [
  'A4', 'C5', 'E5', 'A5', 'E5', 'C5', 'A4', 'E4',
  'G4', 'B4', 'D5', 'G5', 'D5', 'B4', 'G4', 'D4',
  'F4', 'A4', 'C5', 'F5', 'C5', 'A4', 'F4', 'C4',
  'E4', 'G4', 'B4', 'E5', 'B4', 'G4', 'E4', 'B3',
];

const BGM_BASS: string[] = [
  'A2', 'REST', 'A2', 'REST', 'A2', 'REST', 'A2', 'C3',
  'G2', 'REST', 'G2', 'REST', 'G2', 'REST', 'G2', 'B2',
  'F2', 'REST', 'F2', 'REST', 'F2', 'REST', 'F2', 'A2',
  'E2', 'REST', 'E2', 'REST', 'E2', 'REST', 'E2', 'G2',
];

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private currentStep: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isBgmActive(): boolean {
    return this.isBgmPlaying;
  }

  /**
   * Inicia ou Pausa a música de fundo estilo 16-bits Chiptune MIDI
   */
  public toggleBgm(): boolean {
    this.initCtx();
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    this.initCtx();
    if (!this.ctx) return;
    this.isBgmPlaying = true;
    this.currentStep = 0;

    const stepDuration = 120; // 120ms por semicolcheia (~125 BPM)

    this.bgmTimer = window.setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx || this.isMuted) return;

      const time = this.ctx.currentTime;

      // 1. Canal 1: Melodia Principal (Onda Quadrada 16-bit retro)
      const melNote = BGM_MELODY[this.currentStep % BGM_MELODY.length];
      const melFreq = NOTES[melNote] || 0;

      if (melFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(melFreq, time);

        // Envelope Chiptune rápido
        gain.gain.setValueAtTime(0.04, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.1);
      }

      // 2. Canal 2: Baixo Chiptune (Onda Triangular profunda)
      const bassNote = BGM_BASS[this.currentStep % BGM_BASS.length];
      const bassFreq = NOTES[bassNote] || 0;

      if (bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, time);

        bassGain.gain.setValueAtTime(0.08, time);
        bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);

        bassOsc.start(time);
        bassOsc.stop(time + 0.11);
      }

      // 3. Canal 3: Hi-hat / Percussão 16-bits (Ruído branco filtrado) em cada 2º passo
      if (this.currentStep % 2 === 0) {
        this.playChiptunePercussion(time);
      }

      this.currentStep = (this.currentStep + 1) % 32;
    }, stepDuration);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  /**
   * Percussão sintetizada 16-bits (Hi-hat de ruído branco)
   */
  private playChiptunePercussion(time: number) {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.02; // 20ms de ruído
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.015, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(time);
      whiteNoise.stop(time + 0.02);
    } catch {
      // Ignorar
    }
  }

  /**
   * Som de clique de tecla mecânica retro
   */
  public playKeyPress() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450 + Math.random() * 150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Ignorar
    }
  }

  /**
   * Som de bip de varredura/processamento
   */
  public playBeep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1760, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignorar
    }
  }

  /**
   * Som de sucesso Matrix (arpejo cyber de confirmação)
   */
  public playSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.12);
      });
    } catch {
      // Ignorar
    }
  }

  /**
   * Som de alerta de erro (zumbido senoidal/sawtooth baixo)
   */
  public playError() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignorar
    }
  }
}

export const soundFx = new SoundController();
