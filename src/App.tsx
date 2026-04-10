import { useState } from 'react';
import type { Entry, Prompt } from './types';
import CompassLogo from './components/CompassLogo';
import EntryCard from './components/EntryCard';
import ShareModal from './components/ShareModal';
import MemoirView from './components/MemoirView';
import MapView from './components/MapView';
import MountainDivider from './components/MountainDivider';
import Insights from './components/Insights';
import { useVoiceInput } from './hooks/useVoiceInput';
import { useGeoLocation } from './hooks/useGeoLocation';
import { tagEmotion } from './hooks/useEmotionTag';

const PROMPTS: Prompt[] = [
  { id: 'surprise',   icon: '✦', q: "What surprised you today that you wouldn't find at home?", why: 'Cultural contrast' },
  { id: 'senses',     icon: '◈', q: 'Describe a sound or smell you want to remember.',           why: 'Sensory memory' },
  { id: 'food',       icon: '◉', q: 'What did you eat, and what did it remind you of?',           why: 'Food + emotion' },
  { id: 'human',      icon: '◎', q: 'Who did you talk to today? What did they teach you?',        why: 'Human connection' },
  { id: 'notice',     icon: '◆', q: 'What did you notice that tourists usually miss?',            why: 'Slow attention' },
  { id: 'body',       icon: '◐', q: 'How did your body feel in this place?',                      why: 'Physical presence' },
  { id: 'recommend',  icon: '◑', q: 'What would you tell someone who asked if they should come here?', why: 'Your verdict' },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&family=Nunito:wght@400;700;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #ffffff;
    --surface: #f7f6f3;
    --border: #e8e6e1;
    --text: #111110;
    --muted: #999892;
    --accent: #2e7d32;
    --accent-soft: #e8f5e9;
    --rust: #dc4e2a;
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'Inter', system-ui, sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); -webkit-font-smoothing: antialiased; }

  @keyframes compassSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes needlePulse { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(5deg); } 75% { transform: rotate(-5deg); } }
  @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
  @keyframes shimmerWave { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
  @keyframes drawLine { from { stroke-dashoffset: 1200; } to { stroke-dashoffset: 0; } }
  @keyframes starFloat { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-5px); opacity: 0.9; } }
  @keyframes floatBird { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes rotateNeedle { 0% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } 100% { transform: rotate(-8deg); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
  @keyframes slideIn { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }

  .compass-needle { transform-origin: 36px 36px; animation: rotateNeedle 3s ease-in-out infinite; }
  .compass-needle-spin { transform-origin: 36px 36px; animation: compassSpin 1.2s linear infinite; }
  .bird-float { animation: floatBird 2.5s ease-in-out infinite; }
  .bird-float-delay { animation: floatBird 2.5s ease-in-out infinite 0.8s; }
  .fade-up { animation: fadeUp 0.6s ease forwards; }
  .shimmer { animation: shimmerWave 1.8s ease-in-out infinite; }

  .app { min-height: 100vh; background: var(--bg); }

  .header {
    border-bottom: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: sticky;
    top: 0;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    z-index: 10;
  }
  .logo {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .header-right {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--muted);
    font-weight: 300;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    padding: 0 40px;
    background: var(--bg);
  }
  .tab {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 400;
    padding: 14px 0;
    margin-right: 28px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--muted);
    border-bottom: 1.5px solid transparent;
    transition: all 0.15s;
    letter-spacing: 0;
  }
  .tab.active { color: var(--text); border-bottom-color: var(--text); font-weight: 500; }
  .tab:hover { color: var(--text); }

  .main { padding: 48px 40px; max-width: 720px; margin: 0 auto; }

  .composer { margin-bottom: 48px; position: relative; }
  .compass-watermark { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 0; }

  .location-row {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    align-items: center;
  }
  .location-input {
    flex: 1;
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 400;
    font-style: italic;
    border: none;
    background: transparent;
    color: var(--text);
    padding: 4px 0;
    outline: none;
    border-bottom: 1.5px solid var(--border);
    transition: border-color 0.15s;
  }
  .location-input::placeholder { color: var(--border); }
  .location-input:focus { border-bottom-color: var(--text); }
  .date-label {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--muted);
    white-space: nowrap;
    font-weight: 300;
  }

  .prompt-selector {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .prompt-btn {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 400;
    padding: 6px 14px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .prompt-btn:hover { border-color: var(--text); color: var(--text); }
  .prompt-btn.selected { background: var(--text); color: var(--bg); border-color: var(--text); }
  .prompt-btn.filter-active { background: var(--accent); color: white; border-color: var(--accent); }

  .active-prompt {
    margin-bottom: 20px;
    padding: 18px 20px;
    background: var(--surface);
    border-radius: 8px;
    animation: slideIn 0.2s ease;
  }
  .prompt-question {
    font-family: var(--serif);
    font-size: 19px;
    font-weight: 400;
    font-style: italic;
    color: var(--text);
    line-height: 1.5;
    margin-bottom: 4px;
  }
  .prompt-why {
    font-family: var(--sans);
    font-size: 11px;
    color: var(--muted);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .entry-area {
    width: 100%;
    min-height: 140px;
    font-family: var(--serif);
    font-size: 17px;
    font-weight: 400;
    line-height: 1.85;
    border: none;
    border-bottom: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    resize: none;
    outline: none;
    padding: 4px 0 16px;
    position: relative;
    z-index: 1;
  }
  .entry-area::placeholder { color: var(--border); font-style: italic; }

  .entry-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }
  .voice-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 400;
    color: var(--muted);
    background: none;
    border: 1px solid var(--border);
    padding: 9px 16px;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 6px;
  }
  .voice-btn:hover { border-color: var(--text); color: var(--text); }
  .voice-btn.recording {
    background: var(--rust);
    color: white;
    border-color: var(--rust);
  }

  .mic-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: currentColor;
  }
  .mic-dot.recording { animation: pulse 0.8s ease-in-out infinite; }

  .save-btn {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    background: var(--text);
    color: var(--bg);
    border: none;
    padding: 9px 22px;
    cursor: pointer;
    transition: opacity 0.15s;
    border-radius: 6px;
  }
  .save-btn:hover { opacity: 0.8; }
  .save-btn:disabled { opacity: 0.25; cursor: default; }

  .memoir-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border: 1px solid var(--border);
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--sans);
    color: var(--text);
    border-radius: 8px;
  }
  .memoir-trigger:hover { background: var(--surface); border-color: var(--text); }
  .memoir-title { font-size: 15px; font-weight: 500; }
  .memoir-sub { font-size: 12px; color: var(--muted); margin-top: 3px; font-weight: 300; }

  .memoir-output {
    margin-top: 12px;
    padding: 32px 28px;
    background: var(--surface);
    border-radius: 8px;
    animation: fadeUp 0.4s ease;
  }
  .memoir-text {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 400;
    line-height: 1.95;
    color: var(--text);
    white-space: pre-wrap;
  }

  .entries-list { display: flex; flex-direction: column; gap: 0; }
  .entry-card {
    padding: 28px 0;
    border-bottom: 1px solid var(--border);
    animation: fadeUp 0.4s ease;
  }
  .entry-meta {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  .entry-location {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 400;
    font-style: italic;
    color: var(--text);
  }
  .entry-prompt-tag {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 2px 8px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .entry-date {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--muted);
    margin-left: auto;
    font-weight: 300;
  }
  .entry-text {
    font-family: var(--serif);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.85;
    color: var(--text);
    opacity: 0.8;
  }

  .empty {
    text-align: center;
    padding: 80px 20px;
    color: var(--muted);
  }
  .empty-icon { font-size: 28px; margin-bottom: 16px; opacity: 0.3; }
  .empty-text { font-family: var(--serif); font-size: 20px; font-weight: 400; font-style: italic; }
  .empty-sub { font-family: var(--sans); font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 300; }

  .toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--text);
    color: var(--bg);
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 400;
    padding: 10px 18px;
    border-radius: 6px;
    opacity: 0;
    transform: translateY(6px);
    transition: all 0.25s;
    pointer-events: none;
    z-index: 100;
  }
  .toast.show { opacity: 1; transform: translateY(0); }

  .char-count {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--muted);
    font-weight: 300;
  }

  .share-btn {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 5px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .share-btn:hover { border-color: var(--text); color: var(--text); }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }
  .modal {
    background: var(--bg);
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    animation: fadeUp 0.2s ease;
  }
  .modal-title {
    font-family: var(--serif);
    font-size: 22px;
    font-style: italic;
    font-weight: 400;
    margin-bottom: 4px;
  }
  .modal-sub { font-size: 12px; color: var(--muted); margin-bottom: 24px; font-family: var(--sans); }

  .share-card {
    background: #111;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .share-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: #2e7d32;
  }
  .share-card-location {
    font-family: var(--serif);
    font-size: 22px;
    font-style: italic;
    color: #fff;
    margin-bottom: 4px;
  }
  .share-card-prompt {
    font-size: 11px;
    color: #2e7d32;
    font-family: var(--sans);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .share-card-text {
    font-family: var(--serif);
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    line-height: 1.8;
    margin-bottom: 24px;
  }
  .share-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 16px;
  }
  .share-card-brand {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #2e7d32;
  }
  .share-card-date {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
    font-family: var(--sans);
  }

  .modal-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .modal-close {
    position: absolute;
    top: 16px; right: 16px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--muted);
    line-height: 1;
  }

  .map-container { height: calc(100vh - 140px); width: 100%; }
  .leaflet-container { height: 100%; width: 100%; border-radius: 0; }

  .emotion-filters {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  /* Writing tip tooltip */
  .write-tip {
    font-family: var(--sans);
    font-size: 11px;
    color: var(--muted);
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 480px) {
    .header { padding: 16px 20px; }
    .tabs { padding: 0 20px; }
    .tab { margin-right: 16px; font-size: 12px; }
    .main { padding: 32px 20px; }
    .location-input { font-size: 22px; }
    .map-container { height: calc(100vh - 120px); }
    .prompt-question { font-size: 16px; }
  }
`;

export default function App() {
  const [tab, setTab] = useState<'write' | 'journal' | 'memoir' | 'map'>('write');
  const [location, setLocation] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [entryText, setEntryText] = useState('');
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 1,
      location: 'Matera, Italy',
      prompt: 'senses',
      text: 'The cave churches smell like centuries — cold limestone and melted wax, a specific dampness that feels geological. Somewhere below me is a 9,000 year old city and I can feel it. The bells at 7am echo differently here, they bounce between the sassi in a way that makes the whole hillside ring.',
      date: 'March 2026',
    },
    {
      id: 2,
      location: 'Kyoto, Japan',
      prompt: 'notice',
      text: 'The tourists photograph the torii gates. I watched a man spend twenty minutes raking gravel into perfect lines, then start again when a leaf fell. Nobody photographed that. The whole philosophy of the place is in that one gesture.',
      date: 'January 2026',
    },
  ]);
  const [shareEntry, setShareEntry] = useState<Entry | null>(null);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [emotionFilter, setEmotionFilter] = useState<string>('all');

  const showToast = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const { getPosition } = useGeoLocation();

  const { isRecording, startRecording, stopRecording, resetTranscript } = useVoiceInput({
    onTranscript: (text) => {
      setEntryText(text);
    },
    showToast,
  });

  const saveEntry = async () => {
    if (!entryText.trim() || !location.trim()) {
      showToast('Add a location and your entry first');
      return;
    }

    // Stop voice recording if active
    if (isRecording) stopRecording();

    const coords = await getPosition();
    const newEntry: Entry = {
      id: Date.now(),
      location: location.trim(),
      prompt: PROMPTS[selectedPrompt].id,
      text: entryText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      lat: coords?.lat,
      lng: coords?.lng,
    };

    setEntries((prev) => [newEntry, ...prev]);
    resetTranscript();
    setEntryText('');
    setLocation('');
    showToast('Entry saved ✓');

    // Silently tag emotion in background
    const entryId = newEntry.id;
    const entryTextSnap = newEntry.text;
    tagEmotion(entryTextSnap).then((emotion) => {
      if (!emotion) return;
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, emotion } : e))
      );
    });
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Collect unique emotions for filter chips
  const presentEmotions = Array.from(
    new Set(entries.map((e) => e.emotion?.emotion).filter(Boolean) as string[])
  );

  const filteredEntries =
    emotionFilter === 'all'
      ? entries
      : entries.filter((e) => e.emotion?.emotion === emotionFilter);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <CompassLogo size={36} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 900, letterSpacing: '0.05em', color: 'var(--text)' }}>
                SAFARNAMA
              </span>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 400, color: '#2e7d32', letterSpacing: '0.12em' }}>
                सफ़रनामा · travel journal
              </span>
            </div>
          </div>
          <div className="header-right">{today}</div>
        </header>

        <nav className="tabs">
          {(['write', 'journal', 'memoir', 'map'] as const).map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'write' && 'New Entry'}
              {t === 'journal' && `Journal (${entries.length})`}
              {t === 'memoir' && 'Memoir'}
              {t === 'map' && 'Map'}
            </button>
          ))}
        </nav>

        {tab === 'map' ? (
          <div style={{ height: 'calc(100vh - 105px)' }}>
            <MapView
              entries={entries}
              onReadFull={() => {
                setShareEntry(null);
                setTab('journal');
              }}
            />
          </div>
        ) : (
          <main className="main">
            {tab === 'write' && (
              <div className="composer fade-up">
                <div className="location-row">
                  <input
                    className="location-input"
                    placeholder="Where are you?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <span className="date-label">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="prompt-selector">
                  {PROMPTS.map((p, i) => (
                    <button
                      key={p.id}
                      className={`prompt-btn ${selectedPrompt === i ? 'selected' : ''}`}
                      onClick={() => setSelectedPrompt(i)}
                      title={p.q}
                    >
                      <span>{p.icon}</span>
                      <span>{p.why}</span>
                    </button>
                  ))}
                </div>

                <div className="active-prompt">
                  <div className="prompt-question">"{PROMPTS[selectedPrompt].q}"</div>
                  <div className="prompt-why">{PROMPTS[selectedPrompt].why.toUpperCase()}</div>
                </div>

                {/* Faint compass watermark */}
                <div className="compass-watermark" style={{ opacity: 0.04 }}>
                  <svg width="200" height="200" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="36" cy="36" r="32" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
                    <line x1="36" y1="4" x2="36" y2="10" stroke="#1a1a1a" strokeWidth="2" />
                    <line x1="36" y1="62" x2="36" y2="68" stroke="#1a1a1a" strokeWidth="2" />
                    <line x1="4" y1="36" x2="10" y2="36" stroke="#1a1a1a" strokeWidth="2" />
                    <line x1="62" y1="36" x2="68" y2="36" stroke="#1a1a1a" strokeWidth="2" />
                    <g className="compass-needle">
                      <path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32" />
                      <circle cx="36" cy="14" r="2.5" fill="#2e7d32" />
                      <path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity="0.5" />
                    </g>
                    <circle cx="36" cy="36" r="4.5" fill="#1a1a1a" />
                    <circle cx="36" cy="36" r="2.2" fill="#2e7d32" />
                  </svg>
                </div>

                <textarea
                  className="entry-area"
                  placeholder="Write freely, or use voice below..."
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                />

                <div className="entry-actions">
                  <button
                    className={`voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    <span className={`mic-dot ${isRecording ? 'recording' : ''}`} />
                    {isRecording ? '⏸ Pause' : entryText.length > 0 ? '▶ Resume speaking' : '◎ Speak your entry'}
                  </button>
                  <button
                    className="save-btn"
                    onClick={saveEntry}
                  >
                    Save Entry
                  </button>
                </div>

                {entryText.length > 10 && (
                  <div className="write-tip">
                    <span style={{ color: '#2e7d32' }}>◈</span>
                    Tip: write what you felt, not just what you saw
                  </div>
                )}
              </div>
            )}

            {tab === 'journal' && (
              <div>
                <Insights entries={entries} />

                {presentEmotions.length > 0 && (
                  <div className="emotion-filters">
                    <button
                      className={`prompt-btn ${emotionFilter === 'all' ? 'filter-active' : ''}`}
                      onClick={() => setEmotionFilter('all')}
                    >
                      All entries
                    </button>
                    {presentEmotions.map((em) => (
                      <button
                        key={em}
                        className={`prompt-btn ${emotionFilter === em ? 'filter-active' : ''}`}
                        onClick={() => setEmotionFilter(emotionFilter === em ? 'all' : em)}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}

                {filteredEntries.length === 0 && entries.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">◈</div>
                    <div className="empty-text">Your journal is empty.</div>
                    <div className="empty-sub">Start writing to capture what you see.</div>
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="empty">
                    <div className="empty-text">No entries with that emotion.</div>
                    <div className="empty-sub">Try a different filter.</div>
                  </div>
                ) : (
                  <>
                    <MountainDivider />
                    <div className="entries-list">
                      {filteredEntries.map((entry) => (
                        <EntryCard key={entry.id} entry={entry} onShare={setShareEntry} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === 'memoir' && (
              <MemoirView entries={entries} showToast={showToast} />
            )}
          </main>
        )}
      </div>

      {shareEntry && (
        <ShareModal
          entry={shareEntry}
          onClose={() => setShareEntry(null)}
          showToast={showToast}
        />
      )}

      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
