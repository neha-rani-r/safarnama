const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL || '';

export async function callClaude(body: {
  model: string;
  max_tokens: number;
  system: string;
  messages: { role: string; content: string }[];
}): Promise<string> {
  if (!WORKER_URL) throw new Error('VITE_CLOUDFLARE_WORKER_URL not set');

  // Convert Anthropic format → OpenAI/Groq format
  const groqBody = {
    model: 'llama-3.3-70b-versatile',
    max_tokens: body.max_tokens,
    messages: [
      { role: 'system', content: body.system },
      ...body.messages,
    ],
  };

  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groqBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Worker error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
