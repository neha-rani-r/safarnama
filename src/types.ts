export interface Emotion {
  emotion: string;
  secondary: string;
  intensity: number;
  one_word: string;
}

export interface Entry {
  id: number;
  location: string;
  prompt: string;
  text: string;
  date: string;
  lat?: number;
  lng?: number;
  emotion?: Emotion;
}

export interface Prompt {
  id: string;
  icon: string;
  q: string;
  why: string;
}
