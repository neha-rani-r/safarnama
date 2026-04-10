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
}

/* Mini compass needle — left accent mark */
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

export default function EntryCard({ entry, onShare }: EntryCardProps) {
  const prompt = PROMPTS.find((p) => p.id === entry.prompt);

  return (
    <div className="entry-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <CompassAccent />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="entry-meta">
          <span className="entry-location">{entry.location}</span>
          <span className="entry-prompt-tag">{prompt?.why?.toUpperCase()}</span>
          {entry.emotion && <EmotionBadge emotion={entry.emotion} />}
          <span className="entry-date">{entry.date}</span>
        </div>
        <p className="entry-text">{entry.text}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
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
        </div>
      </div>
    </div>
  );
}
