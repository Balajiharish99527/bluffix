// Web Audio API Sound Synthesizer, Haptic Feedback & AI Ambient Soundscape

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticEnabled: boolean = true;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const savedSound = localStorage.getItem("bluffix_sound");
      const savedHaptic = localStorage.getItem("bluffix_haptic");
      this.soundEnabled = savedSound !== "false";
      this.hapticEnabled = savedHaptic !== "false";
    }
  }

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleSound(enable?: boolean): boolean {
    this.soundEnabled = enable !== undefined ? enable : !this.soundEnabled;
    if (!this.soundEnabled) this.stopAmbient();
    if (typeof window !== "undefined") {
      localStorage.setItem("bluffix_sound", String(this.soundEnabled));
    }
    return this.soundEnabled;
  }

  public toggleHaptic(enable?: boolean): boolean {
    this.hapticEnabled = enable !== undefined ? enable : !this.hapticEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("bluffix_haptic", String(this.hapticEnabled));
    }
    return this.hapticEnabled;
  }

  public isSoundEnabled(): boolean { return this.soundEnabled; }
  public isHapticEnabled(): boolean { return this.hapticEnabled; }

  public triggerHaptic(pattern: number | number[] = 50) {
    if (!this.hapticEnabled || typeof navigator === "undefined" || !navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch { }
  }

  /**
   * AI AMBIENT SOUNDSCAPE
   * Dynamically generates cinematic background drones based on game phase
   */
  public playAmbient(phase: "discussion" | "voting" | "lobby") {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    if (!this.ambientOsc) {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      this.ambientOsc.type = "sine";
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2);
      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      this.ambientOsc.start();
    }

    const now = this.ctx.currentTime;
    if (phase === "lobby") {
      this.ambientOsc.frequency.exponentialRampToValueAtTime(110, now + 2); // Low calm drone
    } else if (phase === "discussion") {
      this.ambientOsc.frequency.exponentialRampToValueAtTime(146.83, now + 2); // Mysterious D drone
    } else if (phase === "voting") {
      this.ambientOsc.frequency.exponentialRampToValueAtTime(174.61, now + 1); // Tense F drone
      // Add a small pulse
      const pulse = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      pulse.frequency.value = 440;
      pGain.gain.setValueAtTime(0.02, now);
      pGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      pulse.connect(pGain);
      pGain.connect(this.ctx.destination);
      pulse.start();
      pulse.stop(now + 0.5);
    }
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.ambientOsc) {
          this.ambientOsc.stop();
          this.ambientOsc = null;
        }
      }, 1000);
    }
  }

  // UI Sounds
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
    this.triggerHaptic(20);
  }

  public playTick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  public playVoteCast() {
    this.playClick(); // Use click sound for now as a consistent interaction
  }

  public playRoleReveal(isImpostor: boolean) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (isImpostor) {
      [220, 261, 311].forEach((f, i) => {
        const o = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.05, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1);
        o.connect(g);
        g.connect(this.ctx!.destination);
        o.start(now + i * 0.1);
        o.stop(now + 1);
      });
    } else {
      [261, 329, 392].forEach((f, i) => {
        const o = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.05, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1);
        o.connect(g);
        g.connect(this.ctx!.destination);
        o.start(now + i * 0.1);
        o.stop(now + 1);
      });
    }
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523, 659, 783, 1046].forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.frequency.setValueAtTime(f, now + i * 0.1);
      g.gain.setValueAtTime(0.1, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      o.connect(g);
      g.connect(this.ctx!.destination);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.5);
    });
  }

  public playDefeat() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [400, 300, 200].forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f, now + i * 0.2);
      g.gain.setValueAtTime(0.1, now + i * 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.6);
      o.connect(g);
      g.connect(this.ctx!.destination);
      o.start(now + i * 0.2);
      o.stop(now + i * 0.2 + 0.6);
    });
  }
}

export const sounds = new SoundManager();
