/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      // Lazy initialization on first user interaction
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch((e) => console.log("Audio resume blocked:", e));
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  private createOscillator(
    type: OscillatorType,
    freq: number,
    duration: number,
    gainStart: number = 0.08,
    frequencySweepTo?: number
  ) {
    this.init();
    if (!this.ctx || this.isMuted) return null;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      if (frequencySweepTo) {
        osc.frequency.exponentialRampToValueAtTime(frequencySweepTo, this.ctx.currentTime + duration);
      }

      gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      return { osc, gainNode, ctx: this.ctx };
    } catch (e) {
      console.warn("Sound generation failed:", e);
      return null;
    }
  }

  public playPowerOn() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const duration = 0.5;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + duration);

      gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.log(e);
    }
  }

  public playDriftDetected() {
    const sound = this.createOscillator("sine", 440, 0.25, 0.12, 660);
    if (sound) {
      sound.osc.start();
      sound.osc.stop(sound.ctx.currentTime + 0.25);
    }
  }

  public playProceedAutonomous() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Calm ascending chime (C5 -> G5)
      const now = this.ctx.currentTime;
      const notes = [523.25, 783.99]; // C5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gainNode = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gainNode.gain.setValueAtTime(0.06, now + idx * 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.3);

        osc.connect(gainNode);
        gainNode.connect(this.ctx!.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    } catch (e) {
      console.log(e);
    }
  }

  public playAwaitingConfirmation() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Double pulse tone
      const now = this.ctx.currentTime;
      [0, 0.25].forEach((delay) => {
        const osc = this.ctx!.createOscillator();
        const gainNode = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now + delay);
        gainNode.gain.setValueAtTime(0.08, now + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.2);

        osc.connect(gainNode);
        gainNode.connect(this.ctx!.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      });
    } catch (e) {
      console.log(e);
    }
  }

  public playEscalatedToHuman() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Urgent siren tone with LFO-like sweep
      const now = this.ctx.currentTime;
      const duration = 0.8;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "square";

      osc1.frequency.setValueAtTime(660, now);
      osc2.frequency.setValueAtTime(665, now);

      // Create a sweep simulating a siren (6Hz pitch fluctuation)
      for (let t = 0; t < duration; t += 0.05) {
        const modFreq = 660 + Math.sin(t * Math.PI * 8) * 120;
        osc1.frequency.setValueAtTime(modFreq, now + t);
        osc2.frequency.setValueAtTime(modFreq + 5, now + t);
      }

      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.linearRampToValueAtTime(0.05, now + duration - 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (e) {
      console.log(e);
    }
  }

  public playPlanRevised() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 0.45;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(900, now + duration);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.log(e);
    }
  }

  public playClick() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      // Wood-snap sound (rapid freq sweep from 1000 down to 50 in 40ms)
      const duration = 0.04;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);

      gainNode.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // ignore
    }
  }
}

export const soundSystem = new SoundSystem();
