// Voice Guidance Engine using Web Speech Synthesis API
// Provides paced, meditative voice narration for guided experiences

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
  private rate: number = 0.85;
  private pitch: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      this.initVoice();
    }
  }

  private initVoice(): void {
    const setVoice = () => {
      const voices = speechSynthesis.getVoices();
      // Prefer a calm, clear English voice
      const preferred = voices.find(
        (v) =>
          v.name.includes("Samantha") ||
          v.name.includes("Karen") ||
          v.name.includes("Victoria") ||
          v.name.includes("Moira")
      );
      const fallback = voices.find(
        (v) => v.lang.startsWith("en") && v.name.includes("Female")
      );
      const anyEnglish = voices.find((v) => v.lang.startsWith("en"));
      this.selectedVoice = preferred || fallback || anyEnglish || voices[0] || null;
    };

    setVoice();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = setVoice;
    }
  }

  // Add items to the queue
  enqueue(...items: VoiceQueueItem[]): void {
    this.queue.push(...items);
    if (!this.isProcessing) {
      this.processQueue();
    }
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

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = item.rate ?? this.rate;
      utterance.pitch = item.pitch ?? this.pitch;
      utterance.volume = 0.9;

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

