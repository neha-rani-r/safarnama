import { callClaude } from '../lib/claude';
import type { Emotion } from '../types';

export async function tagEmotion(text: string): Promise<Emotion | null> {
  try {
    const result = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 60,
      system:
        'You are an emotion classifier. Return ONLY valid JSON with no extra text: {"emotion":"<primary>","secondary":"<secondary>","intensity":<0-1>,"one_word":"<single evocative word>"}. Emotions: awe, joy, solitude, wonder, nostalgia, excitement, peace, melancholy, realisation, learning, retrospection, enlightenment, experience.',
      messages: [{ role: 'user', content: text }],
    });
    return JSON.parse(result) as Emotion;
  } catch {
    return null;
  }
}
