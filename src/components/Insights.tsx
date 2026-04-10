import { useState, useEffect } from 'react';
import { callClaude } from '../lib/claude';
import type { Entry } from '../types';

interface InsightsProps {
  entries: Entry[];
}

export default function Insights({ entries }: InsightsProps) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const taggedEntries = entries.filter((e) => e.emotion);

  useEffect(() => {
    if (entries.length < 10) return;
    if (taggedEntries.length < 5) return;

    const fetchInsight = async () => {
      setLoading(true);
      try {
        const emotionSummary = taggedEntries
          .map((e) => `${e.location} (${e.date}): ${e.emotion!.emotion} — ${e.emotion!.one_word}`)
          .join('\n');

        const text = await callClaude({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 120,
          system:
            'You analyse travel journal emotion patterns. Given a list of places and emotions, return a 1-2 sentence insight in second person, e.g. "You feel most alive near [X]. Your [emotion] entries come from [pattern]." Be specific and evocative. No generic advice.',
          messages: [{ role: 'user', content: emotionSummary }],
        });
        setInsight(text);
      } catch {
        // Silently fail — insights are non-critical
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [entries.length]);

  if (entries.length < 10) return null;

  return (
    <div
      style={{
        border: '1px solid #2e7d32',
        background: '#f0f7f0',
        borderRadius: 10,
        padding: '20px 24px',
        marginBottom: 28,
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <svg width="20" height="20" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="30" fill="none" stroke="#2e7d32" strokeWidth="3" />
          <path d="M36,14 L30,32 L36,28 L42,32 Z" fill="#2e7d32" />
          <circle cx="36" cy="14" r="3" fill="#2e7d32" />
          <path d="M36,58 L30,40 L36,44 L42,40 Z" fill="#1a1a1a" opacity="0.3" />
          <circle cx="36" cy="36" r="4" fill="#1a1a1a" />
          <circle cx="36" cy="36" r="2" fill="#2e7d32" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 10,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#2e7d32',
            marginBottom: 8,
          }}
        >
          Your travel pattern
        </div>
        {loading ? (
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 15,
              fontStyle: 'italic',
              color: '#5a7a5a',
              lineHeight: 1.7,
            }}
            className="shimmer"
          >
            Finding patterns in your journeys...
          </div>
        ) : insight ? (
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 15,
              fontStyle: 'italic',
              color: '#1a3a1a',
              lineHeight: 1.7,
            }}
          >
            {insight}
          </div>
        ) : (
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 15,
              fontStyle: 'italic',
              color: '#5a7a5a',
              lineHeight: 1.7,
            }}
          >
            Keep journalling — patterns will emerge from your travels.
          </div>
        )}
      </div>
    </div>
  );
}
