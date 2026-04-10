import { useState } from 'react';
import { callClaude } from '../lib/claude';
import type { Entry, Prompt } from '../types';

const PROMPTS: Prompt[] = [
  { id: 'surprise',   icon: '✦', q: "What surprised you today that you wouldn't find at home?", why: 'Cultural contrast' },
  { id: 'senses',     icon: '◈', q: 'Describe a sound or smell you want to remember.',           why: 'Sensory memory' },
  { id: 'food',       icon: '◉', q: 'What did you eat, and what did it remind you of?',           why: 'Food + emotion' },
  { id: 'human',      icon: '◎', q: 'Who did you talk to today? What did they teach you?',        why: 'Human connection' },
  { id: 'notice',     icon: '◆', q: 'What did you notice that tourists usually miss?',            why: 'Slow attention' },
  { id: 'body',       icon: '◐', q: 'How did your body feel in this place?',                      why: 'Physical presence' },
  { id: 'recommend',  icon: '◑', q: 'What would you tell someone who asked if they should come here?', why: 'Your verdict' },
];

interface MemoirViewProps {
  entries: Entry[];
  showToast: (msg: string) => void;
}

export default function MemoirView({ entries, showToast }: MemoirViewProps) {
  const [memoir, setMemoir] = useState('');
  const [memoirLoading, setMemoirLoading] = useState(false);
  const [memoirOpen, setMemoirOpen] = useState(false);

  const generateMemoir = async () => {
    if (entries.length === 0) {
      showToast('Add some entries first');
      return;
    }
    setMemoirOpen(true);
    setMemoirLoading(true);
    setMemoir('');

    const entrySummary = entries
      .slice(0, 6)
      .map((e) => {
        const prompt = PROMPTS.find((p) => p.id === e.prompt);
        return `[${e.location}, ${e.date}]\nPrompt: "${prompt?.q}"\nEntry: ${e.text}`;
      })
      .join('\n\n---\n\n');

    try {
      const text = await callClaude({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a literary travel memoir writer for Safarnama — a travel journaling app for slow travellers who experience the world deeply. You write in a lyrical, sensory, first-person voice — like Pico Iyer or Patrick Leigh Fermor.

Given a traveller's raw journal entries, synthesise them into a short memoir passage (250-350 words) that captures the emotional truth of their travels.

Write as if you are the traveller. Use specific details from their entries. Focus on atmosphere, feeling, and what it means to move through the world this way.

Do NOT use generic travel writing clichés. Make it feel intimate and real. End with a single sentence that captures what travel does to a person.`,
        messages: [
          {
            role: 'user',
            content: `Here are my recent travel journal entries. Please synthesise them into a personal memoir passage:\n\n${entrySummary}`,
          },
        ],
      });
      setMemoir(text || 'Could not generate memoir. Please try again.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('VITE_CLOUDFLARE_WORKER_URL not set')) {
        showToast('Configure VITE_CLOUDFLARE_WORKER_URL to use AI features');
        setMemoir('AI proxy not configured. Set VITE_CLOUDFLARE_WORKER_URL in your .env file.');
      } else {
        setMemoir('Something went wrong. Check your connection and try again.');
      }
    } finally {
      setMemoirLoading(false);
    }
  };

  const STARS = [
    { top: '12%', left: '4%',  size: 2.5, dur: '2.8s', delay: '0s'   },
    { top: '65%', left: '10%', size: 2,   dur: '3.5s', delay: '0.4s' },
    { top: '25%', left: '80%', size: 3,   dur: '2.2s', delay: '0.9s' },
    { top: '72%', left: '90%', size: 2,   dur: '3.8s', delay: '0.2s' },
    { top: '8%',  left: '55%', size: 2.5, dur: '2.5s', delay: '1.1s' },
    { top: '85%', left: '42%', size: 2,   dur: '4s',   delay: '0.6s' },
    { top: '40%', left: '94%', size: 2.5, dur: '3.2s', delay: '1.4s' },
    { top: '18%', left: '28%', size: 2,   dur: '2.9s', delay: '0.3s' },
    { top: '55%', left: '65%', size: 2.2, dur: '3.6s', delay: '0.7s' },
    { top: '90%', left: '20%', size: 2,   dur: '3s',   delay: '1.2s' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {STARS.map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                borderRadius: '50%',
                background: '#2e7d32',
                animation: `starFloat ${s.dur} ease-in-out infinite ${s.delay}`,
              }}
            />
          ))}
        </div>
        <svg
          width="100%"
          height="32"
          viewBox="0 0 400 32"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: 16, display: 'block' }}
        >
          <path d="M80,20 Q90,14 100,20" fill="none" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" className="bird-float" opacity="0.5" />
          <path d="M115,12 Q127,5 139,12" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" className="bird-float-delay" opacity="0.65" />
          <path d="M155,18 Q164,12 173,18" fill="none" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" className="bird-float" opacity="0.3" />
          <path d="M190,8 Q201,1 212,8" fill="none" stroke="#2e7d32" strokeWidth="2.2" strokeLinecap="round" className="bird-float-delay" opacity="0.7" />
          <path d="M230,16 Q238,10 246,16" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" className="bird-float" opacity="0.25" />
          <path d="M262,6 Q274,0 286,6" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" className="bird-float-delay" opacity="0.55" />
          <path d="M305,14 Q313,8 321,14" fill="none" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" className="bird-float" opacity="0.2" />
        </svg>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 28,
            fontWeight: 300,
            fontStyle: 'italic',
            marginBottom: 8,
          }}
        >
          Your travel memoir, written by AI
        </div>
        <div
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 11,
            color: 'var(--muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Synthesised from {entries.length} journal {entries.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      <button className="memoir-trigger" onClick={generateMemoir}>
        <div>
          <div className="memoir-title">
            {memoir ? 'Regenerate memoir' : 'Generate my memoir'}
          </div>
          <div className="memoir-sub">
            {memoir
              ? 'Create a new synthesis from your entries'
              : 'Let AI find the poetry in your observations'}
          </div>
        </div>
        <span style={{ fontSize: 18, color: 'var(--muted)' }}>→</span>
      </button>

      {memoirOpen && (
        <div className="memoir-output">
          {memoirLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                padding: '20px 0',
              }}
            >
              <svg width="64" height="64" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="32" fill="none" stroke="#e8e6e1" strokeWidth="2" />
                <circle cx="36" cy="36" r="28" fill="none" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.5" />
                <line x1="36" y1="4" x2="36" y2="10" stroke="#1a1a1a" strokeWidth="2" opacity="0.3" />
                <line x1="36" y1="62" x2="36" y2="68" stroke="#1a1a1a" strokeWidth="2" opacity="0.3" />
                <line x1="4" y1="36" x2="10" y2="36" stroke="#1a1a1a" strokeWidth="2" opacity="0.3" />
                <line x1="62" y1="36" x2="68" y2="36" stroke="#1a1a1a" strokeWidth="2" opacity="0.3" />
                <g className="compass-needle-spin">
                  <path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32" />
                  <circle cx="36" cy="14" r="2.5" fill="#2e7d32" />
                  <path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity="0.3" />
                </g>
                <circle cx="36" cy="36" r="4" fill="#1a1a1a" />
                <circle cx="36" cy="36" r="2" fill="#2e7d32" />
              </svg>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 16,
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                  textAlign: 'center',
                  lineHeight: 1.6,
                }}
              >
                Writing your safarnama...
                <br />
                <span style={{ fontSize: 12, opacity: 0.6 }}>
                  finding the poetry in your observations
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="memoir-text">{memoir}</div>
              <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
                <button
                  className="modal-action-btn primary"
                  style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, background: 'var(--text)', color: 'var(--bg)', border: 'none', padding: '9px 18px', borderRadius: 6, cursor: 'pointer' }}
                  onClick={() => {
                    navigator.clipboard.writeText(memoir);
                  }}
                >
                  Copy memoir
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!memoirOpen && entries.length === 0 && (
        <div className="empty" style={{ paddingTop: 40 }}>
          <div className="empty-text">No entries yet.</div>
          <div className="empty-sub">
            Add journal entries first, then generate your memoir.
          </div>
        </div>
      )}
    </div>
  );
}
