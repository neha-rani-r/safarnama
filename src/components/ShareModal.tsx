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
            onClick={() => {
              navigator.clipboard.writeText(`${entry.location}\n\n"${entry.text}"\n\n— Safarnama`);
              showToast('Copied to clipboard');
            }}
          >
            Copy text
          </button>

          {supportsNativeShare ? (
            <button className="modal-action-btn secondary" onClick={handleNativeShare}>
              Share ↗
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                title="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                title="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Snapchat */}
              <a
                href={`https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                title="Snapchat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.34 4.823l.016.009c.284-.142.985-.83.985-2.118 0-.137.06-.266.158-.354.265-.134.538-.106.782.086.44.344.49 1.027.288 1.596-.426 1.193-1.25 1.9-2.162 2.25-.22.082-.5.157-.75.188l-.042.25c-.29 1.611-.82 2.55-1.494 3.122-.574.492-1.22.627-1.79.627-.384 0-.712-.074-.998-.153-.275-.075-.52-.14-.764-.14-.297 0-.6.085-.946.162-.393.083-.793.153-1.19.153-.51 0-.966-.082-1.373-.378-.657-.482-1.22-1.456-1.517-3.387-.252-.03-.503-.105-.723-.187-.912-.35-1.736-1.057-2.162-2.25-.202-.57-.151-1.252.288-1.596.244-.192.517-.22.782-.086a.5.5 0 01.158.354c0 1.288.701 1.976.985 2.118l.016-.009c-.063-1.604-.189-3.63.34-4.823C7.86 1.069 11.217.793 12.206.793z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                style={socialBtnStyle}
                title="X (Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
            </div>
          )}

          <button className="modal-action-btn secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
