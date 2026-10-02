import { LanguageCode } from '../types';

export function getLangLocale(lang: LanguageCode): string {
  switch (lang) {
    case 'Hindi':
      return 'hi-IN';
    case 'Odia':
      return 'or-IN';
    case 'Bengali':
      return 'bn-IN';
    case 'Telugu':
      return 'te-IN';
    case 'Tamil':
      return 'ta-IN';
    case 'English':
    default:
      return 'en-IN';
  }
}

export class TextToSpeechHelper {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static speak(
    text: string,
    language: LanguageCode,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not available');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLocale = getLangLocale(language);
    utterance.lang = targetLocale;
    utterance.rate = 0.95; // Slightly slower, clear cadence for rural patients
    utterance.pitch = 1.0;

    // Pick best matched voice if available
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(targetLocale.split('-')[0]) || v.lang === targetLocale);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public static isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }
}

// Voice Recognition helper for microphone input
export class SpeechRecognitionHelper {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  public static createRecognizer(
    language: LanguageCode,
    onResult: (transcript: string) => void,
    onError?: (error: any) => void,
    onEnd?: () => void
  ): any {
    if (!this.isSupported()) return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getLangLocale(language);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    return recognition;
  }
}
