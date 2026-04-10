const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL || '';

export async function callClaude(body: {
  model: string;
  max_tokens: number;
  system: string;
  messages: { role: string; content: string }[];
}): Promise<string> {
  if (!WORKER_URL) throw new Error('VITE_CLOUDFLARE_WORKER_URL not set');
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data.content?.[0]?.text || '';
}
