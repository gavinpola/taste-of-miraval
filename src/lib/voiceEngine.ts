// Voice Guidance Engine using Web Speech Synthesis API
// Provides paced, meditative voice narration for guided experiences
// Optimized for calm, grounding delivery with text chunking and micro-pauses

export interface VoiceQueueItem {
  text: string;
  pauseAfter?: number; // ms to pause after speaking
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export class VoiceGuidanceEngine {
  private queue: VoiceQueueItem[] = [];
  private isProcessing = false;
  private isCancelled = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private rate: number = 0.72;
  private pitch: number = 0.92;
  private volume: number = 0.85;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private warmedUp = false;

  constructor() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      this.initVoice();
    }
  }

  private initVoice(): void {
    const setVoice = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return;

      // Priority list: calmer, smoother voices first
      const priorityNames = [
        "Samantha (Enhanced)",
        "Moira",
        "Karen",
        "Samantha",
        "Google UK English Female",
        "Microsoft Jenny",
        "Microsoft Zira",
        "Victoria",
        "Tessa",
        "Fiona",
      ];

      let chosen: SpeechSynthesisVoice | null = null;

      // Try priority names first
      for (const name of priorityNames) {
        const match = voices.find((v) => v.name.includes(name));
        if (match) {
          chosen = match;
          break;
        }
      }

      // Fallback: any English female voice
      if (!chosen) {
        chosen =
          voices.find(
            (v) => v.lang.startsWith("en") && /female/i.test(v.name)
          ) || null;
      }

      // Fallback: any English voice
      if (!chosen) {
        chosen = voices.find((v) => v.lang.startsWith("en")) || null;
      }

      // Last resort
      if (!chosen) {
        chosen = voices[0] || null;
      }

      this.selectedVoice = chosen;

      // Warm up the engine with a silent utterance to prevent cold-start artifacts
      if (!this.warmedUp && chosen) {
        this.warmUp();
      }
    };

    setVoice();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = setVoice;
    }
  }

  private warmUp(): void {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance("");
    utterance.volume = 0;
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    speechSynthesis.speak(utterance);
    this.warmedUp = true;
  }

  // Split text into natural chunks at commas, periods, ellipses, em-dashes
  private chunkText(text: string): string[] {
    // Split at sentence-ending punctuation, commas, semicolons, and ellipses
    const chunks = text.split(/(?<=[.!?])\s+|(?<=\.\.\.)\s*|(?<=,)\s+|(?<=;)\s+|(?<=—)\s*/);
    // Filter empty and recombine very short fragments
    const result: string[] = [];
    let buffer = "";
    for (const chunk of chunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;
      buffer = buffer ? `${buffer} ${trimmed}` : trimmed;
      // If buffer is long enough or ends with strong punctuation, flush it
      if (buffer.length >= 20 || /[.!?]$/.test(buffer) || buffer.includes("...")) {
        result.push(buffer);
        buffer = "";
      }
    }
    if (buffer.trim()) result.push(buffer.trim());
    return result.length > 0 ? result : [text];
  }

  // Add items to the queue — text is auto-chunked with micro-pauses
  enqueue(...items: VoiceQueueItem[]): void {
    for (const item of items) {
      const chunks = this.chunkText(item.text);
      if (chunks.length === 1) {
        // Single chunk: keep as-is
        this.queue.push(item);
      } else {
        // Multiple chunks: micro-pause between them, callbacks on first/last
        chunks.forEach((chunk, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === chunks.length - 1;
          this.queue.push({
            text: chunk,
            rate: item.rate,
            pitch: item.pitch,
            pauseAfter: isLast ? item.pauseAfter : this.getMicroPause(chunk),
            onStart: isFirst ? item.onStart : undefined,
            onEnd: isLast ? item.onEnd : undefined,
          });
        });
      }
    }
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Vary micro-pause by punctuation
  private getMicroPause(chunk: string): number {
    if (chunk.includes("...")) return 800;
    if (/[.!?]$/.test(chunk)) return 600;
    if (/[,;]$/.test(chunk)) return 400;
    return 350;
  }

  // Speak a single item immediately (clears queue)
  speak(text: string, pauseAfter?: number): Promise<void> {
    return new Promise((resolve) => {
      this.enqueue({ text, pauseAfter, onEnd: resolve });
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;
    this.isCancelled = false;

    while (this.queue.length > 0 && !this.isCancelled) {
      const item = this.queue.shift()!;
      await this.speakItem(item);

      if (item.pauseAfter && !this.isCancelled) {
        await this.pause(item.pauseAfter);
      }
    }

    this.isProcessing = false;
  }

  private speakItem(item: VoiceQueueItem): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        item.onStart?.();
        setTimeout(() => {
          item.onEnd?.();
          resolve();
        }, 2000);
        return;
      }

      // Cancel any lingering speech to prevent overlap
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = item.rate ?? this.rate;
      utterance.pitch = item.pitch ?? this.pitch;
      utterance.volume = this.volume;

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onstart = () => item.onStart?.();
      utterance.onend = () => {
        item.onEnd?.();
        this.currentUtterance = null;
        resolve();
      };
      utterance.onerror = () => {
        this.currentUtterance = null;
        resolve();
      };

      this.currentUtterance = utterance;
      speechSynthesis.speak(utterance);
    });
  }

  private pause(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  cancel(): void {
    this.isCancelled = true;
    this.queue = [];
    if (typeof window !== "undefined" && window.speechSynthesis) {
      speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.isProcessing = false;
  }

  isSpeaking(): boolean {
    return this.isProcessing;
  }

  setRate(rate: number): void {
    this.rate = rate;
  }

  setPitch(pitch: number): void {
    this.pitch = pitch;
  }
}

// Singleton
let voiceInstance: VoiceGuidanceEngine | null = null;

export function getVoiceEngine(): VoiceGuidanceEngine {
  if (!voiceInstance) {
    voiceInstance = new VoiceGuidanceEngine();
  }
  return voiceInstance;
}
