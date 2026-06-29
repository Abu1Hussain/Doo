/**
 * Sentry Sound System - High-fidelity Synthesized Sound Effects
 * Built using the native Web Audio API. Requires no external audio files or dependencies.
 */

export type SoundEffectType = 
  | 'approved' 
  | 'denied' 
  | 'pending_mfa' 
  | 'generalConversation' 
  | 'transferFunds' 
  | 'readSalaryRecords' 
  | 'deleteBackup'
  | 'click'
  | 'success_mfa'
  | 'alarm_transfer'
  | 'alarm_data'
  | 'alarm_delete'
  | 'alarm_injection';

class SentryAudioEngine {
  private ctx: AudioContext | null = null;
  private currentVolume: number = 0.5;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialization of AudioContext to satisfy browser autoplay policies
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn("Failed to initialize Web Audio API Context:", e);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.warn("Failed to resume AudioContext:", e));
    }

    return this.ctx;
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play a beautifully synthesized secure notification chime, sweep, or critical alarm.
   */
  public play(type: SoundEffectType) {
    if (this.isMuted) return;
    
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.connect(ctx.destination);

      // 1. APPROVED / SAFE ACTION
      if (type === 'approved') {
        // Multi-frequency ascending digital chime representing verification success
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.25, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc1.connect(localGain);
        osc2.connect(localGain);
        localGain.connect(masterGain);
        
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(1.0, now + 0.02);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
      } 
      
      // 2. DENIED / SECURITY VIOLATION ALARM
      else if (type === 'denied') {
        // High-pitched warning klaxon with dual-oscillator frequency modulation (wah-wah alarm siren)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(660, now); // E5
        
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(665, now); // Detuned square for grit

        // LFO modulates the alarm pitch to create an authentic dynamic siren
        lfo.frequency.setValueAtTime(6, now); // 6 Hz vibration
        lfoGain.gain.setValueAtTime(150, now); // 150 Hz frequency deviation

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.15, now + 0.05);
        
        // Let's pulse the volume
        localGain.gain.setValueAtTime(this.currentVolume * 0.15, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.05, now + 0.3);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.18, now + 0.6);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.05, now + 0.9);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc1.connect(localGain);
        osc2.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        lfo.start(now);
        osc1.start(now);
        osc2.start(now);
        
        lfo.stop(now + 1.25);
        osc1.stop(now + 1.25);
        osc2.stop(now + 1.25);
      } 
      
      // 3. PENDING MFA WARNING
      else if (type === 'pending_mfa') {
        // A pulsing digital warning tone. Double pulse.
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        
        const localGain = ctx.createGain();
        // Pulse 1
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.35, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        
        // Pulse 2
        localGain.gain.setValueAtTime(0, now + 0.3);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.35, now + 0.35);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.65);
      } 
      
      // 4. ACTION TYPE: GENERAL CONVERSATION
      else if (type === 'generalConversation') {
        // Soft digital notification blip
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.25, now + 0.02);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.35);
      } 
      
      // 5. ACTION TYPE: TRANSFER FUNDS
      else if (type === 'transferFunds') {
        // Retro synthetic coin register drop "Ching"
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1567.98, now + 0.08); // G6

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1318.51, now + 0.04); // E6
        osc2.frequency.exponentialRampToValueAtTime(2093.00, now + 0.2); // C7

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.3, now + 0.04);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc1.connect(localGain);
        osc2.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
      } 
      
      // 6. ACTION TYPE: READ SALARY RECORDS
      else if (type === 'readSalaryRecords') {
        // Fast technical binary sweep
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.35);

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.3, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.45);
      } 
      
      // 7. ACTION TYPE: DELETE BACKUP
      else if (type === 'deleteBackup') {
        // Deep power-down alert
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.linearRampToValueAtTime(55, now + 0.4); // A1

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.4, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.55);
      }

      // 8. CLICK FEEDBACK
      else if (type === 'click') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.15, now + 0.005);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.06);
      }

      // 9. MFA SUCCESS CHIME
      else if (type === 'success_mfa') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.3, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.5);
      }

      // 10. ALARM: TRANSFER FUNDS VIOLATION
      else if (type === 'alarm_transfer') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        osc2.frequency.setValueAtTime(885, now);
        
        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.25, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        // second pulse
        localGain.gain.setValueAtTime(0, now + 0.25);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.25, now + 0.3);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

        osc1.connect(localGain);
        osc2.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.6);
        osc2.stop(now + 0.6);
      }

      // 11. ALARM: DATA ACCESS BREACH
      else if (type === 'alarm_data') {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now); // E4
        osc.frequency.linearRampToValueAtTime(110, now + 0.4); // E2 sweep down

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.Q.setValueAtTime(15, now);

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.4, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(filter);
        filter.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.5);
      }

      // 12. ALARM: BACKUP DELETION SENSITIVITY BLOCK
      else if (type === 'alarm_delete') {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);

        // Add white noise burst
        let noiseNode: AudioBufferSourceNode | null = null;
        try {
          const bufferSize = ctx.sampleRate * 0.6;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          noiseNode = ctx.createBufferSource();
          noiseNode.buffer = noiseBuffer;
          
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(150, now);
          
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(this.currentVolume * 0.15, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
          
          noiseNode.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(masterGain);
        } catch (e) {
          // Fallback if buffer creation fails
        }

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.35, now + 0.05);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        osc.start(now);
        osc.stop(now + 0.7);
        if (noiseNode) {
          noiseNode.start(now);
          noiseNode.stop(now + 0.7);
        }
      }

      // 13. ALARM: ADVERSARIAL PROMPT INJECTION RED-ALERT
      else if (type === 'alarm_injection') {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(500, now);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(8, now); // 8Hz rapid warble
        lfoGain.gain.setValueAtTime(250, now); // 250Hz frequency swing

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        const localGain = ctx.createGain();
        localGain.gain.setValueAtTime(0, now);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.2, now + 0.05);
        localGain.gain.linearRampToValueAtTime(this.currentVolume * 0.2, now + 0.7);
        localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

        osc.connect(localGain);
        localGain.connect(masterGain);

        masterGain.gain.setValueAtTime(1.0, now);

        lfo.start(now);
        osc.start(now);
        
        lfo.stop(now + 0.9);
        osc.stop(now + 0.9);
      }
    } catch (e) {
      console.warn("Error synthesizing sound effect:", e);
    }
  }
}

export const sentryAudio = new SentryAudioEngine();
