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

export default function ShareModal({ entry, onClose, showToast }: ShareModalProps) {
  if (!entry) return null;

  const prompt = PROMPTS.find((p) => p.id === entry.prompt);
  const shareText = `"${entry.text}"\n\n— ${entry.location}, ${entry.date}\n\nSafarnama सफ़रनामा`;
  const encodedText = encodeURIComponent(shareText);

  const supportsNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: `Safarnama — ${entry.location}`, text: shareText });
    } catch { /* user cancelled */ }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if ((e.target as HTMLElement).className === 'modal-backdrop') onClose(); }}
    >
      <div style={{
        background: 'var(--bg)', borderRadius: 20, width: '100%', maxWidth: 500,
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        animation: 'fadeUp 0.2s ease', boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'var(--surface)',
          border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
          fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
        }}>×</button>

        {/* Share card — the thing people actually post */}
        <div style={{
          background: 'linear-gradient(160deg, #0a0f0a 0%, #111a11 50%, #0a0a0f 100%)',
          borderRadius: '20px 20px 0 0',
          padding: '36px 32px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative compass watermark */}
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.04 }}>
            <svg width="160" height="160" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
              <circle cx="36" cy="36" r="32" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="36" cy="36" r="24" fill="none" stroke="white" strokeWidth="1"/>
              <line x1="36" y1="4" x2="36" y2="68" stroke="white" strokeWidth="1" opacity="0.5"/>
              <line x1="4" y1="36" x2="68" y2="36" stroke="white" strokeWidth="1" opacity="0.5"/>
              <path d="M36,8 L30,30 L36,26 L42,30 Z" fill="white"/>
              <path d="M36,64 L30,42 L36,46 L42,42 Z" fill="white" opacity="0.4"/>
              <circle cx="36" cy="36" r="5" fill="white"/>
            </svg>
          </div>

          {/* Stars scattered */}
          {[{x:'8%',y:'15%'},{x:'45%',y:'8%'},{x:'75%',y:'20%'},{x:'15%',y:'60%'},{x:'85%',y:'55%'}].map((s,i)=>(
            <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, width: 2, height: 2, borderRadius: '50%', background: '#2e7d32', opacity: 0.6 }}/>
          ))}

          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #2e7d32, transparent)' }}/>

          {/* Location + prompt */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontStyle: 'italic', color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
              {entry.location}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#2e7d32', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                {prompt?.why}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>·</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
                {entry.date}
              </span>
            </div>
          </div>

          {/* Opening quote mark */}
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, color: '#2e7d32', lineHeight: 0.5, marginBottom: 12, opacity: 0.6 }}>"</div>

          {/* Entry text */}
          <div style={{
            fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 400,
            lineHeight: 1.85, color: 'rgba(255,255,255,0.88)', marginBottom: 28,
          }}>
            {entry.text.length > 280 ? entry.text.slice(0, 280) + '…' : entry.text}
          </div>

          {/* Bottom bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', color: '#2e7d32' }}>SAFARNAMA</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>सफ़रनामा · travel journal</div>
            </div>
            <svg width="24" height="24" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" opacity="0.5">
              <circle cx="36" cy="36" r="30" fill="none" stroke="#2e7d32" strokeWidth="3"/>
              <path d="M36,14 L30,32 L36,28 L42,32 Z" fill="#2e7d32"/>
              <circle cx="36" cy="36" r="4" fill="#2e7d32"/>
            </svg>
          </div>
        </div>

        {/* Share actions */}
        <div style={{ padding: '24px 32px 28px' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Share this moment
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {supportsNativeShare ? (
              <button onClick={handleNativeShare} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px', background: '#111110', color: 'white', border: 'none',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, width: '100%'
              }}>
                Share ↗
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <a href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px', background: '#25D366', color: 'white',
                  borderRadius: 10, textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => { navigator.clipboard.writeText(shareText); showToast('Copied — paste as your Instagram caption'); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px', background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
                    color: 'white', borderRadius: 10, textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('"' + entry.text.slice(0,200) + '"\n\n— ' + entry.location + '\n\nSafarnama सफ़रनामा')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px', background: '#000', color: 'white',
                    borderRadius: 10, textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                  X / Twitter
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText(shareText); showToast('Copied to clipboard'); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px', background: 'var(--surface)', color: 'var(--text)',
                    border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500
                  }}
                >
                  Copy text
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
