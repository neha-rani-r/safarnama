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

interface ShareModalProps {
  entry: Entry | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

const socialBtnStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%' as const,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  cursor: 'pointer' as const,
  color: 'var(--muted)',
  transition: 'all 0.15s',
  textDecoration: 'none' as const,
  flexShrink: 0,
};

export default function ShareModal({ entry, onClose, showToast }: ShareModalProps) {
  if (!entry) return null;

  const prompt = PROMPTS.find((p) => p.id === entry.prompt);
  const shareText = `${entry.text}\n\n— Safarnama सफ़रनामा`;
  const shareTitle = `Safarnama — ${entry.location}`;
  const supportsNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: window.location.href });
    } catch {
      // user cancelled or share not completed
    }
  };

  const encodedText = encodeURIComponent(`${shareText}\n\n${window.location.href}`);
  const encodedUrl = encodeURIComponent(window.location.href);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).className === 'modal-backdrop') onClose();
      }}
    >
      <div className="modal" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-title">Share this moment</div>
        <div className="modal-sub">{entry.location} · {entry.date}</div>

        <div className="share-card">
          <div className="share-card-location">{entry.location}</div>
          <div className="share-card-prompt">{prompt?.why}</div>
          <div className="share-card-text">"{entry.text}"</div>
          <div className="share-card-footer">
            <div className="share-card-brand">SAFARNAMA</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="30" fill="none" stroke="#2e7d32" strokeWidth="3" />
                <path d="M36,14 L30,32 L36,28 L42,32 Z" fill="#2e7d32" />
                <circle cx="36" cy="14" r="3" fill="#2e7d32" />
                <path d="M36,58 L30,40 L36,44 L42,40 Z" fill="rgba(255,255,255,0.4)" />
                <circle cx="36" cy="36" r="4" fill="#1a1a1a" />
                <circle cx="36" cy="36" r="2" fill="#2e7d32" />
              </svg>
              <span className="share-card-date">{entry.date}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="modal-action-btn primary"
            style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, background: 'var(--text)', color: 'var(--bg)', border: 'none', padding: '9px 18px', borderRadius: 6, cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(`${entry.location}\n\n"${entry.text}"\n\n— Safarnama`);
              showToast('Copied to clipboard');
            }}
          >
            Copy text
          </button>

          {supportsNativeShare ? (
            <button
              style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', padding: '9px 18px', borderRadius: 6, cursor: 'pointer' }}
              onClick={handleNativeShare}
            >
              Share ↗
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <a href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer" style={socialBtnStyle} title="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodedText}`} target="_blank" rel="noopener noreferrer" style={socialBtnStyle} title="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" style={socialBtnStyle} title="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          )}

          <button
            style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', padding: '9px 18px', borderRadius: 6, cursor: 'pointer' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
