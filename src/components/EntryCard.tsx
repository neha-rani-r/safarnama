import { useState } from 'react';
import type { Entry, Prompt } from '../types';
import EmotionBadge from './EmotionBadge';

const PROMPTS: Prompt[] = [
  { id: 'surprise',   icon: '✦', q: "What surprised you today that you wouldn't find at home?", why: 'Cultural contrast' },
  { id: 'senses',     icon: '◈', q: 'Describe a sound or smell you want to remember.',           why: 'Sensory memory' },
  { id: 'food',       icon: '◉', q: 'What did you eat, and what did it remind you of?',           why: 'Food + emotion' },
  { id: 'human',      icon: '◎', q: 'Who did you talk to today? What did they teach you?',        why: 'Human connection' },
  { id: 'notice',     icon: '◆', q: 'What did you notice that tourists usually miss?',            why: 'Slow attention' },
  { id: 'body',       icon: '◐', q: 'How did your body feel in this place?',                      why: 'Physical presence' },
  { id: 'recommend',  icon: '◑', q: 'What would you tell someone who asked if they should come here?', why: 'Your verdict' },
];

interface EntryCardProps {
  entry: Entry;
  onShare: (entry: Entry) => void;
  onDelete?: (id: number) => void;
}

function CompassAccent() {
  return (
    <svg
      width="8"
      height="44"
      viewBox="0 0 8 44"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, marginTop: 4, opacity: 0.65 }}
    >
      <path d="M4,2 L1,22 L4,17 L7,22 Z" fill="#2e7d32" />
      <path d="M4,42 L1,22 L4,27 L7,22 Z" fill="#1a1a1a" opacity="0.2" />
      <circle cx="4" cy="22" r="2.8" fill="#1a1a1a" opacity="0.25" />
      <circle cx="4" cy="22" r="1.3" fill="#2e7d32" opacity="0.8" />
    </svg>
  );
}

export default function EntryCard({ entry, onShare, onDelete }: EntryCardProps) {
  const prompt = PROMPTS.find((p) => p.id === entry.prompt);
  const [expanded, setExpanded] = useState(false);
  const isLong = entry.text.length > 240;
  const displayText = isLong && !expanded ? entry.text.slice(0, 240) + '…' : entry.text;

  return (
    <div className="entry-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <CompassAccent />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="entry-meta">
          <span className="entry-location">{entry.location}</span>
          <span className="entry-prompt-tag">{prompt?.why?.toUpperCase() ?? entry.prompt}</span>
          {entry.emotion && <EmotionBadge emotion={entry.emotion} />}
          <span className="entry-date">{entry.date}</span>
        </div>
        <p className="entry-text">{displayText}</p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 11,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              padding: '4px 0',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
          <button
            className="share-btn"
            onClick={() => onShare(entry)}
            title="Share this entry"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M11 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM5 5a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 5 5zm6 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="currentColor"/>
              <path d="M9.5 6.5L6.5 8M6.5 8L9.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Share
          </button>
          {entry.lat && entry.lng && (
            <span
              title={`${entry.lat.toFixed(4)}, ${entry.lng.toFixed(4)}`}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 10,
                color: 'var(--accent)',
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
              on map
            </span>
          )}
          {onDelete && (
            <button
              className="share-btn"
              onClick={() => {
                if (window.confirm('Delete this entry?')) onDelete(entry.id);
              }}
              title="Delete entry"
              style={{ marginLeft: 'auto', color: '#dc4e2a', borderColor: 'transparent' }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
