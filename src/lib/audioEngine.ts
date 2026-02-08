// Procedural Audio Engine for Miraval experiences
// Generates ambient soundscapes entirely in the browser via Web Audio API

type OscType = OscillatorType;

interface DroneConfig {
  frequency: number;
  type: OscType;
  gain: number;
  detune?: number;
}

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private activeGains: GainNode[] = [];
  private isPlaying = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getMaster(): GainNode {
    this.getContext();
    return this.masterGain!;
  }

  // Create a binaural beat (two slightly detuned tones in L/R ears)
  private createBinaural(baseFreq: number, beatFreq: number, gain: number): void {
    const ctx = this.getContext();
    const master = this.getMaster();

    // Left ear
    const oscL = ctx.createOscillator();
    const gainL = ctx.createGain();
    const panL = ctx.createStereoPanner();
    oscL.frequency.value = baseFreq;
    oscL.type = "sine";
    gainL.gain.value = gain;
    panL.pan.value = -1;
    oscL.connect(gainL).connect(panL).connect(master);
    oscL.start();
    this.activeNodes.push(oscL);
    this.activeGains.push(gainL);

    // Right ear
    const oscR = ctx.createOscillator();
    const gainR = ctx.createGain();
    const panR = ctx.createStereoPanner();
    oscR.frequency.value = baseFreq + beatFreq;
    oscR.type = "sine";
    gainR.gain.value = gain;
    panR.pan.value = 1;
    oscR.connect(gainR).connect(panR).connect(master);
    oscR.start();
    this.activeNodes.push(oscR);
    this.activeGains.push(gainR);
  }

  // Create layered drones
  private createDrones(drones: DroneConfig[]): void {
    const ctx = this.getContext();
    const master = this.getMaster();

    drones.forEach((d) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = d.frequency;
      osc.type = d.type;
      if (d.detune) osc.detune.value = d.detune;
      gain.gain.value = d.gain;
      osc.connect(gain).connect(master);
      osc.start();
      this.activeNodes.push(osc);
      this.activeGains.push(gain);
    });
  }

  // Create filtered noise (wind, rain, ocean-like)
  private createNoise(
    type: "wind" | "rain" | "ocean" | "fire",
    gain: number
  ): void {
    const ctx = this.getContext();
    const master = this.getMaster();
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;

    switch (type) {
      case "wind":
        filter.type = "lowpass";
        filter.frequency.value = 400;
        filter.Q.value = 1;
        // Modulate for organic feel
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain).connect(filter.frequency);
        lfo.start();
        this.activeNodes.push(lfo);
        break;
      case "rain":
        filter.type = "bandpass";
        filter.frequency.value = 8000;
        filter.Q.value = 0.5;
        break;
      case "ocean":
        filter.type = "lowpass";
        filter.frequency.value = 600;
        filter.Q.value = 2;
        break;
      case "fire":
        filter.type = "bandpass";
        filter.frequency.value = 1200;
        filter.Q.value = 0.8;
        break;
    }

    source.connect(filter).connect(gainNode).connect(master);
    source.start();
    this.activeNodes.push(source);
    this.activeGains.push(gainNode);
  }

  // Create singing bowl tone
  private createBowl(frequency: number, gain: number): void {
    const ctx = this.getContext();
    const master = this.getMaster();

    // Fundamental
    const osc1 = ctx.createOscillator();
    osc1.frequency.value = frequency;
    osc1.type = "sine";

    // Harmonic
    const osc2 = ctx.createOscillator();
    osc2.frequency.value = frequency * 2.76;
    osc2.type = "sine";

    const g1 = ctx.createGain();
    g1.gain.value = gain;
    const g2 = ctx.createGain();
    g2.gain.value = gain * 0.3;

    osc1.connect(g1).connect(master);
    osc2.connect(g2).connect(master);
    osc1.start();
    osc2.start();

    this.activeNodes.push(osc1, osc2);
    this.activeGains.push(g1, g2);
  }

  // Preset: Meditation (for HMR, general meditation)
  playMeditation(): void {
    this.stop();
    this.createBinaural(174, 4, 0.06); // Theta binaural for deep relaxation
    this.createDrones([
      { frequency: 87, type: "sine", gain: 0.04 },
      { frequency: 130.81, type: "sine", gain: 0.03, detune: 3 },
    ]);
    this.createNoise("wind", 0.015);
    this.fadeIn(3);
  }

  // Preset: Earth element
  playEarth(): void {
    this.stop();
    this.createBinaural(108, 3, 0.05); // Deep grounding
    this.createDrones([
      { frequency: 54, type: "sine", gain: 0.06 },
      { frequency: 108, type: "triangle", gain: 0.03 },
      { frequency: 162, type: "sine", gain: 0.02 },
    ]);
    this.createNoise("wind", 0.008);
    this.fadeIn(4);
  }

  // Preset: Water element
  playWater(): void {
    this.stop();
    this.createBinaural(216, 6, 0.04);
    this.createDrones([
      { frequency: 174, type: "sine", gain: 0.04 },
      { frequency: 261.63, type: "sine", gain: 0.025, detune: 5 },
    ]);
    this.createNoise("ocean", 0.03);
    this.createNoise("rain", 0.01);
    this.fadeIn(4);
  }

  // Preset: Fire element
  playFire(): void {
    this.stop();
    this.createBinaural(288, 8, 0.04);
    this.createDrones([
      { frequency: 220, type: "sawtooth", gain: 0.015 },
      { frequency: 329.63, type: "sine", gain: 0.03 },
      { frequency: 440, type: "sine", gain: 0.02 },
    ]);
    this.createNoise("fire", 0.025);
    this.fadeIn(4);
  }

  // Preset: Air element
  playAir(): void {
    this.stop();
    this.createBinaural(396, 10, 0.03);
    this.createDrones([
      { frequency: 396, type: "sine", gain: 0.025 },
      { frequency: 528, type: "sine", gain: 0.02, detune: 7 },
    ]);
    this.createNoise("wind", 0.04);
    this.fadeIn(4);
  }

  // Preset: Spirit/Ether element
  playSpirit(): void {
    this.stop();
    this.createBinaural(432, 7.83, 0.04); // Schumann resonance beat
    this.createBowl(432, 0.03);
    this.createBowl(528, 0.02);
    this.createDrones([
      { frequency: 216, type: "sine", gain: 0.025 },
    ]);
    this.createNoise("wind", 0.008);
    this.fadeIn(4);
  }

  // Preset: Qigong practice
  playQigong(): void {
    this.stop();
    this.createBinaural(256, 5, 0.04);
    this.createDrones([
      { frequency: 128, type: "sine", gain: 0.03 },
      { frequency: 192, type: "sine", gain: 0.02 },
    ]);
    this.createNoise("wind", 0.01);
    this.createBowl(341, 0.015);
    this.fadeIn(3);
  }

  // Preset: Resolution / release (warm, major key)
  playResolution(): void {
    this.stop();
    this.createBinaural(261.63, 4, 0.04); // C4 with theta
    this.createDrones([
      { frequency: 261.63, type: "sine", gain: 0.035 },
      { frequency: 329.63, type: "sine", gain: 0.025 },
      { frequency: 392, type: "sine", gain: 0.02 },
    ]);
    this.createBowl(528, 0.02);
    this.createNoise("wind", 0.005);
    this.fadeIn(4);
  }

  fadeIn(duration: number = 3): void {
    const master = this.getMaster();
    const ctx = this.getContext();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + duration);
    this.isPlaying = true;
  }

  fadeOut(duration: number = 3): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    this.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    setTimeout(() => this.stop(), duration * 1000 + 100);
  }

  stop(): void {
    this.activeNodes.forEach((n) => {
      try { n.stop(); } catch { /* already stopped */ }
    });
    this.activeNodes = [];
    this.activeGains = [];
    this.isPlaying = false;
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  dispose(): void {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }
}

// Singleton
let engineInstance: AmbientAudioEngine | null = null;

export function getAudioEngine(): AmbientAudioEngine {
  if (!engineInstance) {
    engineInstance = new AmbientAudioEngine();
  }
  return engineInstance;
}

