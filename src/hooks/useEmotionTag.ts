import { callClaude } from '../lib/claude';
import type { Emotion } from '../types';

export async function tagEmotion(text: string): Promise<Emotion | null> {
  try {
    const result = await callClaude({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 80,
      system:
        'You are an emotion classifier. Return ONLY valid JSON — no markdown, no backticks, no explanation: {"emotion":"<primary>","secondary":"<secondary>","intensity":<0.0-1.0>,"one_word":"<single evocative word>"}. Allowed emotions: awe, joy, solitude, wonder, nostalgia, excitement, peace, melancholy, realisation, learning, retrospection, enlightenment, experience.',
      messages: [{ role: 'user', content: text }],
    });
    const cleaned = result.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as Emotion;
  } catch {
    return null;
  }
}
